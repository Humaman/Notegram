export interface NoteCreateInput {
  messageId: string;

  text?: string | null;
  caption?: string | null;
  images?: string | null;
  videos?: string | null;
  audio?: string | null;
  doc?: string | null;
  voice?: string | null;
}
