export type SenderRole = 'user' | 'astrologer';

export type MessageType = 'text' | 'audio' | 'image';

export interface Message {
  id: string;
  sender: SenderRole;
  type: MessageType;
  content?: string;
  timestamp: Date;
  audioDuration?: string;
  imageUrl?: string;
}
