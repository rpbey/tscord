declare enum AdditionalLocaleString {
	English = 'en'
}

type TranslationsNestedPaths = NestedPaths<import('@/i18n').Translations>

type LocalizationMap = Partial<Record<`${import('discord-api-types/v9').Locale | AdditionalLocaleString}`, string>>

type SanitizedOptions = {
	descriptionLocalizations?: LocalizationMap
	nameLocalizations?: LocalizationMap
	localizationSource?: TranslationsNestedPaths
}

type Sanitization<K> = Modify<K, SanitizedOptions>

type ApplicationCommandOptions = Sanitization<
    WithOptional<import('@rpbey/discordx').ApplicationCommandOptions<string, string>, 'description'>
>

type SlashGroupOptions = Sanitization<
    WithOptional<import('@rpbey/discordx').SlashGroupOptions<string, string, string>, 'description'>
>

type SlashOptionOptions = Sanitization<
    WithOptional<import('@rpbey/discordx').SlashOptionOptions<string, string>, 'description'>
>

type SlashChoiceOption = Modify<import('@rpbey/discordx').SlashChoiceType<string, string | number>, SanitizedOptions>

type ContextMenuOptionsX = Omit<import('@rpbey/discordx').ApplicationCommandOptions<import('@rpbey/discordx').NotEmpty<string>, string> & {
	type: Exclude<import('discord.js').ApplicationCommandType, import('discord.js').ApplicationCommandType.ChatInput>
}, 'description' | 'descriptionLocalizations'>

type ContextMenuOptions = Modify<Modify<ContextMenuOptionsX, SanitizedOptions>, {
	type: ContextMenuOptionsX['type'] | 'USER' | 'MESSAGE'
}>
