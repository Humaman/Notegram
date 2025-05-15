export interface NoteCreateInput {
  messageId: string;

  text?: string | null;
  caption?: string | null;
  image?: string | null;
  video?: string | null;
  audio?: string | null;
  doc?: string | null;
  voice?: string | null;
}
