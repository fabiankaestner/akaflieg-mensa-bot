FROM denoland/deno:1.32.1

WORKDIR /app

# Prefer not to run as root.
USER deno

# These steps will be re-run upon each file change in your working directory:
COPY . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts

CMD ["deno", "run", "--allow-env", "--allow-net", "--allow-read=.env,.env.defaults,.env.example", "--no-prompt", "main.ts"]