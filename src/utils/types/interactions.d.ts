// oxlint-disable typescript-eslint/consistent-type-imports
// `import()` ambient pour exposer ces types globalement sans avoir à les
// importer dans chaque fichier consumer. Pattern .d.ts standard.
// https://stackoverflow.com/questions/39040108/import-class-in-definition-file-d-ts

type EmittedInteractions =
  | import("discord.js").CommandInteraction
  | import("@rpbey/discordx").SimpleCommandMessage
  | import("discord.js").ContextMenuCommandInteraction;
type OnTheFlyInteractions =
  | import("discord.js").ButtonInteraction
  | import("discord.js").StringSelectMenuInteraction
  | import("discord.js").ModalSubmitInteraction;

type AllInteractions = EmittedInteractions | OnTheFlyInteractions;

type InteractionsConstants =
  | "CHAT_INPUT_COMMAND_INTERACTION"
  | "SIMPLE_COMMAND_MESSAGE"
  | "CONTEXT_MENU_INTERACTION"
  | "BUTTON_INTERACTION"
  | "SELECT_MENU_INTERACTION"
  | "STRING_SELECT_MENU_INTERACTION"
  | "MODAL_SUBMIT_INTERACTION";

type CommandCategory = import("@rpbey/discordx").DApplicationCommand &
  import("@rpbey/utilities").ICategory;

type InteractionData = {
  sanitizedLocale: import("src/i18n").Locales;
  localize: import("src/i18n/i18n-types").TranslationFunctions;
};
