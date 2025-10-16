import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { TutorTag } from '@/components/agent/tutor/TutorChatMessage';

/**
 * Firestoreのメッセージドキュメントのタグを更新する
 * @param uid - ユーザーID
 * @param threadId - スレッドID
 * @param messageFsId - FirestoreのメッセージドキュメントID
 * @param tags - 更新後のタグ配列
 */
export async function updateMessageTags(
  uid: string,
  threadId: string,
  messageFsId: string,
  tags: TutorTag[]
): Promise<void> {
  try {
    const messageRef = doc(db, 'users', uid, 'eduAI_threads', threadId, 'messages', messageFsId);
    await setDoc(messageRef, { tags }, { merge: true });
  } catch (error) {
    console.error('[updateMessageTags] Failed to update tags in Firestore:', error);
    // エラーハンドリング: 必要に応じてUIにフィードバックするためのカスタムエラーをスローするなど
    throw new Error('Failed to update message tags.');
  }
}
