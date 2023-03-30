import { load } from "std/dotenv/mod.ts";
import { cron } from "cron";
import { Telegraf } from "telegraf";

const env = await load({
  restrictEnvAccessTo: ["TELEGRAM_TOKEN", "GROUP_ID", "CRON_SCHEDULE"],
});
console.log(Deno.env.get("TELEGRAM_TOKEN"));
console.log(env);

const bot = new Telegraf(env.TELEGRAM_TOKEN);

bot.command("mensa", async (ctx) => {
  await ctx.sendPoll(
    "Heute Mensa?",
    ["11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "später"],
    { is_anonymous: false }
  );
  console.log("Sending Mensa Poll to Chat: ", await ctx.getChat());
});

if (env.CRON_SCHEDULE !== undefined) {
  cron(env.CRON_SCHEDULE, () => {
    if (env.GROUP_ID !== undefined) {
      console.log("Sending Mensa Poll to default ID: ", env.GROUP_ID);
      bot.telegram.sendPoll(
        env.GROUP_ID,
        "Heute Mensa?",
        ["11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "später"],
        { is_anonymous: false }
      );
    }
  });
}

bot.launch();
