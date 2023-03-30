import { load } from "std/dotenv/mod.ts";
import { cron } from "cron";
import { Telegraf } from "telegraf";

await load({
  restrictEnvAccessTo: ["TELEGRAM_TOKEN", "GROUP_ID", "CRON_SCHEDULE"],
  export: true,
});

const bot = new Telegraf(Deno.env.get("TELEGRAM_TOKEN") || "");

bot.command("mensa", async (ctx) => {
  await ctx.sendPoll(
    "Heute Mensa?",
    ["11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "später"],
    { is_anonymous: false }
  );
  console.log("Sending Mensa Poll to Chat: ", await ctx.getChat());
});

if (Deno.env.get("CRON_SCHEDULE") !== undefined) {
  cron(Deno.env.get("CRON_SCHEDULE"), () => {
    if (Deno.env.get("GROUP_ID") !== undefined) {
      console.log(
        "Sending Mensa Poll to default ID: ",
        Deno.env.get("GROUP_ID")
      );
      bot.telegram.sendPoll(
        Deno.env.get("GROUP_ID") || "",
        "Heute Mensa?",
        ["11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "später"],
        { is_anonymous: false }
      );
    }
  });
}

bot.launch();
