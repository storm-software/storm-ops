{ ... }:
{
  name = "storm-software/storm-ops";

  dotenv.enable = true;
  dotenv.filename = [".env" ".env.local"];

  # https://devenv.sh/basics/
  env.DEFAULT_LOCALE = "en_US";
  env.DEFAULT_TIMEZONE = "America/New_York";

  # See full reference at https://devenv.sh/reference/options/
}

