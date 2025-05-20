import { generateOneTimePassword } from '../../common/create-user';

export async function getYandexPassword(tgId: string) {
  const pass = generateOneTimePassword(tgId);
  await prisma.user.update({
    where: { tg_id: tgId },
    data: { yandex_password: pass },
  });
  const escapedPass = pass.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
  return escapedPass;
}
