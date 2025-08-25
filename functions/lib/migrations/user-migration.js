"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateExistingUsers = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-admin/firestore");
const firebase_functions_1 = require("firebase-functions");
/**
 * 既存ユーザーデータのマイグレーション関数
 * 既存のWeb版ユーザーに不足しているフィールドを追加
 */
exports.migrateExistingUsers = (0, https_1.onCall)(async (request) => {
    // 認証情報の確認
    if (!request.auth) {
        throw new Error("Authentication required");
    }
    const uid = request.auth.uid;
    if (!uid) {
        throw new Error("User ID not found in authentication context");
    }
    const db = (0, firestore_1.getFirestore)();
    try {
        const userRef = db.collection("users").doc(uid);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error("User does not exist");
        }
        const userData = userDoc.data();
        const updates = {};
        // roleフィールドがない場合は追加
        if (!(userData === null || userData === void 0 ? void 0 : userData.role)) {
            updates.role = "user";
        }
        // mobileProfileフィールドがない場合はnullで追加
        if (!(userData === null || userData === void 0 ? void 0 : userData.hasOwnProperty('mobileProfile'))) {
            updates.mobileProfile = null;
        }
        // webProfileの構造チェック
        if (!(userData === null || userData === void 0 ? void 0 : userData.webProfile)) {
            updates.webProfile = {
                lastWebLogin: firestore_1.FieldValue.serverTimestamp(),
                isWebUser: true,
                preferences: {
                    theme: "light",
                    notifications: true,
                    language: "ja",
                },
            };
        }
        // subscriptionの構造チェック
        if (!(userData === null || userData === void 0 ? void 0 : userData.subscription)) {
            updates.subscription = {
                plan: "free_web",
                status: "active",
                currentPeriodStart: firestore_1.FieldValue.serverTimestamp(),
                currentPeriodEnd: null,
                stripeCustomerId: null,
                stripeSubscriptionId: null,
            };
        }
        else {
            // subscription構造の修正
            const subscription = userData.subscription;
            if (!subscription.hasOwnProperty("stripeCustomerId")) {
                updates["subscription.stripeCustomerId"] = null;
            }
            if (!subscription.hasOwnProperty("stripeSubscriptionId")) {
                updates["subscription.stripeSubscriptionId"] = null;
            }
        }
        // 不足フィールドの追加
        const requiredFields = [
            "bio", "birthday", "gender", "currentMonsterId",
            "coins", "xp", "level",
            "groupSessionCount", "groupTotalMinutes",
            "individualSessionCount", "individualTotalMinutes"
        ];
        for (const field of requiredFields) {
            if (!userData.hasOwnProperty(field)) {
                switch (field) {
                    case "bio":
                        updates[field] = "";
                        break;
                    case "birthday":
                    case "gender":
                        updates[field] = null;
                        break;
                    case "currentMonsterId":
                        updates[field] = "monster-01";
                        break;
                    case "coins":
                        updates[field] = 100; // 既存ユーザーにもボーナス
                        break;
                    case "xp":
                        updates[field] = 0;
                        break;
                    case "level":
                        updates[field] = 1;
                        break;
                    case "groupSessionCount":
                    case "groupTotalMinutes":
                    case "individualSessionCount":
                    case "individualTotalMinutes":
                        updates[field] = 0;
                        break;
                    default:
                        // TypeScript exhaustiveness check
                        break;
                }
            }
        }
        if (Object.keys(updates).length > 0) {
            updates.updatedAt = firestore_1.FieldValue.serverTimestamp();
            await userRef.update(updates);
            firebase_functions_1.logger.log("User migrated successfully:", uid, {
                updatedFields: Object.keys(updates),
            });
            return {
                success: true,
                message: "User data migrated successfully",
                updatedFields: Object.keys(updates),
            };
        }
        else {
            return {
                success: true,
                message: "No migration needed",
                updatedFields: [],
            };
        }
    }
    catch (error) {
        firebase_functions_1.logger.error("Error migrating user data:", error);
        throw new Error("Failed to migrate user data");
    }
});
//# sourceMappingURL=user-migration.js.map