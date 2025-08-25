"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeUserData = exports.migrateExistingUsers = void 0;
const https_1 = require("firebase-functions/v2/https");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const firebase_functions_1 = require("firebase-functions");
// マイグレーション関数をエクスポート
var user_migration_1 = require("./migrations/user-migration");
Object.defineProperty(exports, "migrateExistingUsers", { enumerable: true, get: function () { return user_migration_1.migrateExistingUsers; } });
(0, app_1.initializeApp)();
// ユーザー作成時のデータベース初期化（Web・Mobile共通関数）
exports.initializeUserData = (0, https_1.onCall)(async (request) => {
    var _a, _b, _c, _d;
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
        // ユーザーが既に存在する場合は何もしない
        if (userDoc.exists) {
            firebase_functions_1.logger.log("User already exists:", uid);
            return { success: true, message: "User already initialized" };
        }
        // トークン情報の安全な取得
        const authToken = request.auth.token;
        const email = (authToken === null || authToken === void 0 ? void 0 : authToken.email) || null;
        const displayName = (authToken === null || authToken === void 0 ? void 0 : authToken.name) || (email === null || email === void 0 ? void 0 : email.split('@')[0]) || "ユーザー";
        const photoURL = (authToken === null || authToken === void 0 ? void 0 : authToken.picture) || "";
        const emailVerified = (authToken === null || authToken === void 0 ? void 0 : authToken.email_verified) || false;
        // 既存Web版構造と互換性のあるユーザー初期データを作成
        const userData = {
            // 基本プロフィール情報
            bio: "",
            birthday: null,
            displayName,
            email,
            emailVerified,
            gender: null,
            photoURL,
            role: "user",
            // ゲーミフィケーション要素（既存構造維持）
            coins: 100,
            xp: 0,
            level: 1,
            currentMonsterId: "monster-01",
            // 学習データ（既存構造維持）
            groupSessionCount: 0,
            groupTotalMinutes: 0,
            individualSessionCount: 0,
            individualTotalMinutes: 0,
            // システム情報
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
            // Web版専用フィールド（既存構造維持）
            subscription: {
                plan: (((_a = request.data) === null || _a === void 0 ? void 0 : _a.platform) === "mobile" ? "free" : "free_web"),
                status: "active",
                currentPeriodStart: firestore_1.FieldValue.serverTimestamp(),
                currentPeriodEnd: null,
                stripeCustomerId: null,
                stripeSubscriptionId: null,
            },
            webProfile: {
                lastWebLogin: firestore_1.FieldValue.serverTimestamp(),
                isWebUser: ((_b = request.data) === null || _b === void 0 ? void 0 : _b.platform) !== "mobile",
                preferences: {
                    theme: "light",
                    notifications: true,
                    language: "ja",
                },
            },
            // モバイル版専用フィールド（将来の統合用）
            mobileProfile: ((_c = request.data) === null || _c === void 0 ? void 0 : _c.platform) === "mobile" ? {
                grade: null,
                school: null,
                subjects: [],
                goals: [],
                streak: 0,
                lastActiveAt: firestore_1.FieldValue.serverTimestamp(),
                platform: "mobile",
                version: "1.0.0",
            } : null,
        };
        await userRef.set(userData);
        firebase_functions_1.logger.log("User initialized successfully:", uid, {
            platform: ((_d = request.data) === null || _d === void 0 ? void 0 : _d.platform) || "web",
            role: userData.role,
            subscription: userData.subscription.plan,
        });
        return {
            success: true,
            message: "User initialized successfully",
            userData: {
                displayName: userData.displayName,
                role: userData.role,
                subscription: userData.subscription,
                coins: userData.coins,
                xp: userData.xp,
                level: userData.level,
            },
        };
    }
    catch (error) {
        firebase_functions_1.logger.error("Error initializing user data:", error);
        throw new Error("Failed to initialize user data");
    }
});
//# sourceMappingURL=index.js.map