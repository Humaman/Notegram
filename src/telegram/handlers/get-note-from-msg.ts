import { NoteCreateInput } from '../types/note-create.interface';

export function getNoteFromMsg(msg: any): NoteCreateInput {
  return {
    messageId: msg.message_id,
    text: msg.text ?? undefined,
    caption: msg.caption ?? undefined,
    image: msg.photo ? msg.photo.at(-1)?.file_id : undefined,
    video: msg.video ? msg.video.file_id : undefined,
    audio: msg.audio ? msg.audio.file_id : undefined,
    doc: msg.document ? msg.document.file_id : undefined,
  };
}
