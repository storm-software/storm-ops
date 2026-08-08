#!/usr/bin/env node
import chalk from "chalk";
import { Command } from "commander";
import { workspaceConfigSchema } from "@storm-software/config/schema";
import defu from "defu";
import { existsSync } from "node:fs";
import { loadConfig } from "c12";
import "date-fns/formatDistanceToNow";
import { join } from "node:path";
import { COLOR_KEYS, STORM_DEFAULT_DOCS, STORM_DEFAULT_ERROR_CODES_FILE, STORM_DEFAULT_HOMEPAGE, STORM_DEFAULT_LICENSE, STORM_DEFAULT_LICENSING } from "@storm-software/config";
import { readFile } from "node:fs/promises";
//#region src/types.ts
const LogLevel = {
	SILENT: 0,
	FATAL: 10,
	ERROR: 20,
	WARN: 30,
	SUCCESS: 35,
	INFO: 40,
	PERFORMANCE: 50,
	DEBUG: 60,
	TRACE: 70,
	ALL: 100
};
const LogLevelLabel = {
	SILENT: "silent",
	FATAL: "fatal",
	ERROR: "error",
	WARN: "warn",
	SUCCESS: "success",
	INFO: "info",
	PERFORMANCE: "performance",
	DEBUG: "debug",
	TRACE: "trace",
	ALL: "all"
};
//#endregion
//#region src/utilities/colors.ts
/**
* Storm theme config values used for styling various workspace elements
*/
const DEFAULT_COLOR_CONFIG = {
	light: {
		background: "#fafafa",
		foreground: "#1d1e22",
		brand: "#1fb2a6",
		alternate: "#db2777",
		discovery: "#5C4EE5",
		success: "#087f5b",
		info: "#0550ae",
		debug: "#8afafc",
		warning: "#e3b341",
		danger: "#D8314A",
		fatal: "#51070f",
		performance: "#13c302",
		link: "#3fa6ff",
		positive: "#22c55e",
		negative: "#dc2626",
		gradient: [
			"#1fb2a6",
			"#db2777",
			"#5C4EE5"
		]
	},
	dark: {
		background: "#1e2124",
		foreground: "#cbd5e1",
		brand: "#2dd4bf",
		alternate: "#db2777",
		discovery: "#818cf8",
		success: "#10b981",
		info: "#58a6ff",
		debug: "#8afafc",
		warning: "#f3d371",
		danger: "#D8314A",
		fatal: "#a40e26",
		performance: "#80fd74",
		link: "#3fa6ff",
		positive: "#22c55e",
		negative: "#dc2626",
		gradient: [
			"#1fb2a6",
			"#db2777",
			"#818cf8"
		]
	}
};
/**
* Get the color configuration from the Storm workspace configuration.
*
* @param config - An optional, partial color configuration for the Storm workspace.
* @returns The color configuration, or the default color configuration if not defined.
*/
function getColors(config) {
	if (!config?.colors || typeof config.colors !== "object" || !config.colors["dark"] && (!config.colors["base"] || typeof config.colors !== "object" || !config.colors["base"]?.["dark"])) return DEFAULT_COLOR_CONFIG;
	if (config.colors["base"]) {
		if (typeof config.colors["base"]["dark"] === "object") return config.colors["base"]["dark"];
		else if (config.colors["base"]["dark"] === "string") return config.colors["base"];
	}
	if (typeof config.colors["dark"] === "object") return config.colors["dark"];
	return config.colors ?? DEFAULT_COLOR_CONFIG;
}
/**
* Get a specific color from the Storm workspace configuration.
*
* @param key - The key of the color to retrieve.
* @param config - An optional, partial color configuration for the Storm workspace.
* @returns The color value for the specified key, or a default value if not defined.
*/
function getColor(key, config) {
	const colors = getColors(config);
	const result = (typeof colors["dark"] === "object" ? colors["dark"][key] : colors[key]) || DEFAULT_COLOR_CONFIG["dark"][key] || DEFAULT_COLOR_CONFIG[key];
	if (result) return result;
	if (key === "link" || key === "debug") return getColor("info", config);
	else if (key === "fatal") return getColor("danger", config);
	return getColor("brand", config);
}
//#endregion
//#region src/logger/chalk.ts
const chalkDefault = {
	hex: (_) => (message) => message,
	bgHex: (_) => ({
		whiteBright: (message) => message,
		white: (message) => message
	}),
	white: (message) => message,
	whiteBright: (message) => message,
	gray: (message) => message,
	bold: {
		hex: (_) => (message) => message,
		bgHex: (_) => ({
			whiteBright: (message) => message,
			white: (message) => message
		}),
		whiteBright: (message) => message,
		white: (message) => message
	},
	dim: {
		hex: (_) => (message) => message,
		gray: (message) => message
	}
};
/**
* Get the chalk instance
*
* @remarks
* Annoying polyfill to temporarily fix the issue with the `chalk` import
*
* @returns The chalk instance
*/
const getChalk = () => {
	let _chalk = chalk;
	if (!_chalk?.hex || !_chalk?.bold?.hex || !_chalk?.bgHex || !_chalk?.whiteBright || !_chalk?.white) _chalk = chalkDefault;
	return _chalk;
};
//#endregion
//#region src/logger/is-unicode-supported.ts
function isUnicodeSupported() {
	if (process.platform !== "win32") return process.env.TERM !== "linux";
	return Boolean(process.env.WT_SESSION) || Boolean(process.env.TERMINUS_SUBLIME) || process.env.ConEmuTask === "{cmd::Cmder}" || process.env.TERM_PROGRAM === "Terminus-Sublime" || process.env.TERM_PROGRAM === "vscode" || process.env.TERM === "xterm-256color" || process.env.TERM === "alacritty" || process.env.TERM === "rxvt-unicode" || process.env.TERM === "rxvt-unicode-256color" || process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}
//#endregion
//#region src/logger/console-icons.ts
const useIcon = (c, fallback) => isUnicodeSupported() ? c : fallback;
const CONSOLE_ICONS = {
	[LogLevelLabel.ERROR]: useIcon("✘", "×"),
	[LogLevelLabel.FATAL]: useIcon("🕱", "×"),
	[LogLevelLabel.WARN]: useIcon("⚠", "‼"),
	[LogLevelLabel.INFO]: useIcon("ℹ", "i"),
	[LogLevelLabel.PERFORMANCE]: useIcon("⏱", "⏱"),
	[LogLevelLabel.SUCCESS]: useIcon("✔", "√"),
	[LogLevelLabel.DEBUG]: useIcon("🛠", "D"),
	[LogLevelLabel.TRACE]: useIcon("⚙", "T"),
	[LogLevelLabel.ALL]: useIcon("✉", "→")
};
//#endregion
//#region src/logger/format-timestamp.ts
/**
* Format a timestamp to a human-readable string.
*
* @param fullDateTime Whether to include the full date and time in the formatted string (defaults to `false`, which only includes the time)
* @param date The date to format.
* @returns The formatted timestamp.
*/
const formatTimestamp = (fullDateTime = false, date = /* @__PURE__ */ new Date()) => {
	return fullDateTime ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}` : `${date.toLocaleTimeString()}`;
};
//#endregion
//#region src/logger/get-log-level.ts
/**
* Convert the log level label to a log level
*
* @param label - The log level label to convert
* @returns The log level
*/
const getLogLevel = (label) => {
	switch (label) {
		case "all": return LogLevel.ALL;
		case "trace": return LogLevel.TRACE;
		case "debug": return LogLevel.DEBUG;
		case "performance": return LogLevel.PERFORMANCE;
		case "info": return LogLevel.INFO;
		case "warn": return LogLevel.WARN;
		case "error": return LogLevel.ERROR;
		case "fatal": return LogLevel.FATAL;
		case "silent": return LogLevel.SILENT;
		default: return LogLevel.INFO;
	}
};
/**
* Convert the log level to a log level label
*
* @param logLevel - The log level to convert
* @returns The log level label
*/
const getLogLevelLabel = (logLevel = LogLevel.INFO) => {
	if (logLevel >= LogLevel.ALL) return LogLevelLabel.ALL;
	if (logLevel >= LogLevel.TRACE) return LogLevelLabel.TRACE;
	if (logLevel >= LogLevel.DEBUG) return LogLevelLabel.DEBUG;
	if (logLevel >= LogLevel.PERFORMANCE) return LogLevelLabel.PERFORMANCE;
	if (logLevel >= LogLevel.INFO) return LogLevelLabel.INFO;
	if (logLevel >= LogLevel.WARN) return LogLevelLabel.WARN;
	if (logLevel >= LogLevel.ERROR) return LogLevelLabel.ERROR;
	if (logLevel >= LogLevel.FATAL) return LogLevelLabel.FATAL;
	if (logLevel <= LogLevel.SILENT) return LogLevelLabel.SILENT;
	return LogLevelLabel.INFO;
};
//#endregion
//#region src/logger/console.ts
/**
* Get the log function for a log level
*
* @param logLevel - The log level
* @param config - The Storm configuration
* @returns The log function
*/
const getLogFn = (logLevel = LogLevel.INFO, config = {}, options = {}) => {
	const { chalk: _chalk = getChalk(), fullDateTime = false, hideDateTime = false } = options;
	const colors = !config.colors?.dark && !config.colors?.["base"] && !config.colors?.["base"]?.dark ? DEFAULT_COLOR_CONFIG : config.colors?.dark && typeof config.colors.dark === "string" ? config.colors : config.colors?.["base"]?.dark && typeof config.colors["base"].dark === "string" ? config.colors["base"].dark : config.colors?.["base"] ? config.colors?.["base"] : DEFAULT_COLOR_CONFIG;
	const configLogLevel = config.logLevel || process.env.STORM_LOG_LEVEL || LogLevelLabel.INFO;
	if (logLevel > getLogLevel(configLogLevel) || logLevel <= LogLevel.SILENT || getLogLevel(configLogLevel) <= LogLevel.SILENT) return (_) => {};
	if (typeof logLevel === "number" && LogLevel.FATAL >= logLevel) return (message) => {
		console.error(`
${hideDateTime ? "" : `${_chalk.gray(formatTimestamp(fullDateTime))} `}${_chalk.hex(colors.fatal ?? DEFAULT_COLOR_CONFIG.dark.fatal)(`[${CONSOLE_ICONS[LogLevelLabel.FATAL]} Fatal] `)}${_chalk.bold.whiteBright(formatLogMessage(message))}
`);
	};
	if (typeof logLevel === "number" && LogLevel.ERROR >= logLevel) return (message) => {
		console.error(`
${hideDateTime ? "" : `${_chalk.gray(formatTimestamp(fullDateTime))} `}${_chalk.hex(colors.danger ?? DEFAULT_COLOR_CONFIG.dark.danger)(`[${CONSOLE_ICONS[LogLevelLabel.ERROR]} Error] `)}${_chalk.bold.whiteBright(formatLogMessage(message))}
`);
	};
	if (typeof logLevel === "number" && LogLevel.WARN >= logLevel) return (message) => {
		console.warn(`
${hideDateTime ? "" : `${_chalk.gray(formatTimestamp(fullDateTime))} `}${_chalk.hex(colors.warning ?? DEFAULT_COLOR_CONFIG.dark.warning)(`[${CONSOLE_ICONS[LogLevelLabel.WARN]} Warn] `)}${_chalk.bold.whiteBright(formatLogMessage(message))}
`);
	};
	if (typeof logLevel === "number" && LogLevel.SUCCESS >= logLevel) return (message) => {
		console.info(`
${hideDateTime ? "" : `${_chalk.gray(formatTimestamp(fullDateTime))} `}${_chalk.hex(colors.success ?? DEFAULT_COLOR_CONFIG.dark.success)(`[${CONSOLE_ICONS[LogLevelLabel.SUCCESS]} Success] `)}${_chalk.bold.whiteBright(formatLogMessage(message))}
`);
	};
	if (typeof logLevel === "number" && LogLevel.INFO >= logLevel) return (message) => {
		console.info(`
${hideDateTime ? "" : `${_chalk.gray(formatTimestamp(fullDateTime))} `}${_chalk.hex(colors.info ?? DEFAULT_COLOR_CONFIG.dark.info)(`[${CONSOLE_ICONS[LogLevelLabel.INFO]} Info] `)}${_chalk.bold.whiteBright(formatLogMessage(message))}
`);
	};
	if (typeof logLevel === "number" && LogLevel.PERFORMANCE >= logLevel) return (message) => {
		console.debug(`
${hideDateTime ? "" : `${_chalk.gray(formatTimestamp(fullDateTime))} `}${_chalk.hex(colors.performance ?? DEFAULT_COLOR_CONFIG.dark.performance)(`[${CONSOLE_ICONS[LogLevelLabel.PERFORMANCE]} Performance] `)}${_chalk.bold.whiteBright(formatLogMessage(message))}
`);
	};
	if (typeof logLevel === "number" && LogLevel.DEBUG >= logLevel) return (message) => {
		console.debug(`
${hideDateTime ? "" : `${_chalk.gray(formatTimestamp(fullDateTime))} `}${_chalk.hex(colors.debug ?? DEFAULT_COLOR_CONFIG.dark.debug)(`[${CONSOLE_ICONS[LogLevelLabel.DEBUG]} Debug] `)}${_chalk.bold.whiteBright(formatLogMessage(message))}
`);
	};
	if (typeof logLevel === "number" && LogLevel.TRACE >= logLevel) return (message) => {
		console.debug(`
${hideDateTime ? "" : `${_chalk.gray(formatTimestamp(fullDateTime))} `}${_chalk.hex("#bbbbbb")(`[${CONSOLE_ICONS[LogLevelLabel.TRACE]} Trace] `)}${_chalk.bold.whiteBright(formatLogMessage(message))}
`);
	};
	return (message) => {
		console.log(`
${hideDateTime ? "" : `${_chalk.gray(formatTimestamp(fullDateTime))} `}${_chalk.hex(colors.brand ?? DEFAULT_COLOR_CONFIG.dark.brand)(`[${CONSOLE_ICONS[LogLevelLabel.ALL]} System] `)}${_chalk.bold.whiteBright(formatLogMessage(message))}
`);
	};
};
/**
* Write a message to the console at the `fatal` log level
*
* @param message - The message to write
* @param config - The Storm configuration
*/
const writeFatal = (message, config) => getLogFn(LogLevel.FATAL, config)(message);
/**
* Write a message to the console at the `error` log level
*
* @param message - The message to write
* @param config - The Storm configuration
*/
const writeError = (message, config) => getLogFn(LogLevel.ERROR, config)(message);
/**
* Write a message to the console at the `warning` log level
*
* @param message - The message to write
* @param config - The Storm configuration
*/
const writeWarning = (message, config) => getLogFn(LogLevel.WARN, config)(message);
/**
* Write a message to the console at the `info` log level
*
* @param message - The message to write
* @param config - The Storm configuration
*/
const writeInfo = (message, config) => getLogFn(LogLevel.INFO, config)(message);
/**
* Write a message to the console at the `success` log level
*
* @param message - The message to write
* @param config - The Storm configuration
*/
const writeSuccess = (message, config) => getLogFn(LogLevel.SUCCESS, config)(message);
/**
* Write a message to the console at the `trace` log level
*
* @param message - The message to write
* @param config - The Storm configuration
*/
const writeTrace = (message, config) => getLogFn(LogLevel.TRACE, config)(message);
const MAX_DEPTH = 10;
/**
* Format a log message for output to the console, handling different types of messages (e.g. strings, objects, arrays) and applying formatting options such as prefixing and skipping certain keys in objects.
*
* @param message - The message to format
* @param options - Formatting options
* @param depth - The current depth of recursion
* @returns The formatted log message
*/
const formatLogMessage = (message, options = {}, depth = 0) => {
	if (depth > MAX_DEPTH) return "<max depth>";
	const prefix = options.prefix ?? "";
	const skip = options.skip ?? [];
	const sort = options.sort ?? true;
	return typeof message === "undefined" || message === null ? "<empty>" : typeof message === "string" ? !message ? "<empty string>" : message : Array.isArray(message) ? `\n${message.sort(sort ? (a, b) => !a && !b ? 0 : !a ? 1 : !b ? -1 : String(a).localeCompare(String(b)) : void 0).map((item, index) => ` ${prefix}> #${index} = ${formatLogMessage(item, {
		prefix: `${prefix}--`,
		skip,
		sort
	}, depth + 1)}`).join("\n")}` : typeof message === "object" && message ? `\n${Object.keys(message).filter((key) => typeof key !== "string" || !skip.map((k) => k.toLowerCase().trim()).includes(key.toLowerCase().trim())).sort(sort ? (a, b) => !a && !b ? 0 : !a ? 1 : !b ? -1 : String(a).localeCompare(String(b)) : void 0).map((key) => ` ${prefix}> ${key} = ${_isFunction(message[key]) ? "<function>" : typeof message[key] === "object" && message[key] ? Object.keys(message[key]).filter((key) => typeof key !== "string" || !skip.map((k) => k.toLowerCase().trim()).includes(key.toLowerCase().trim())).length === 0 ? "{}" : formatLogMessage(message[key], {
		prefix: `${prefix}--`,
		skip,
		sort
	}, depth + 1) : message[key]}`).join("\n")}` : String(message);
};
const _isFunction = (value) => {
	try {
		return value instanceof Function || typeof value === "function" || !!(value?.constructor && value?.call && value?.apply);
	} catch {
		return false;
	}
};
/**
* Get the brand icon for the console
*
* @param config - The Storm configuration
* @param _chalk - The chalk instance
* @returns The brand icon
*/
const brandIcon = (config = {}, _chalk = getChalk()) => _chalk.hex(getColor("brand", config))("🗲");
//#endregion
//#region src/utilities/correct-paths.ts
const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
	if (!input) return input;
	return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _UNC_REGEX = /^[/\\]{2}/;
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
const correctPaths = function(path) {
	if (!path || path.length === 0) return ".";
	path = normalizeWindowsPath(path);
	const isUNCPath = path?.match(_UNC_REGEX);
	const isPathAbsolute = isAbsolute(path);
	const trailingSeparator = path[path.length - 1] === "/";
	path = normalizeString(path, !isPathAbsolute);
	if (path.length === 0) {
		if (isPathAbsolute) return "/";
		return trailingSeparator ? "./" : ".";
	}
	if (trailingSeparator) path += "/";
	if (_DRIVE_LETTER_RE.test(path)) path += "/";
	if (isUNCPath) {
		if (!isPathAbsolute) return `//./${path}`;
		return `//${path}`;
	}
	return isPathAbsolute && !isAbsolute(path) ? `/${path}` : path;
};
const joinPaths = function(...segments) {
	let path = "";
	for (const seg of segments) {
		if (!seg) continue;
		if (path.length > 0) {
			const pathTrailing = path[path.length - 1] === "/";
			const segLeading = seg[0] === "/";
			if (pathTrailing && segLeading) path += seg.slice(1);
			else path += pathTrailing || segLeading ? seg : `/${seg}`;
		} else path += seg;
	}
	return correctPaths(path);
};
/**
* Resolves a string path, resolving '.' and '.' segments and allowing paths above the root.
*
* @param path - The path to normalise.
* @param allowAboveRoot - Whether to allow the resulting path to be above the root directory.
* @returns the normalised path string.
*/
function normalizeString(path, allowAboveRoot) {
	let res = "";
	let lastSegmentLength = 0;
	let lastSlash = -1;
	let dots = 0;
	let char = null;
	for (let index = 0; index <= path.length; ++index) {
		if (index < path.length) char = path[index];
		else if (char === "/") break;
		else char = "/";
		if (char === "/") {
			if (lastSlash === index - 1 || dots === 1) {} else if (dots === 2) {
				if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
					if (res.length > 2) {
						const lastSlashIndex = res.lastIndexOf("/");
						if (lastSlashIndex === -1) {
							res = "";
							lastSegmentLength = 0;
						} else {
							res = res.slice(0, lastSlashIndex);
							lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
						}
						lastSlash = index;
						dots = 0;
						continue;
					} else if (res.length > 0) {
						res = "";
						lastSegmentLength = 0;
						lastSlash = index;
						dots = 0;
						continue;
					}
				}
				if (allowAboveRoot) {
					res += res.length > 0 ? "/.." : "..";
					lastSegmentLength = 2;
				}
			} else {
				if (res.length > 0) res += `/${path.slice(lastSlash + 1, index)}`;
				else res = path.slice(lastSlash + 1, index);
				lastSegmentLength = index - lastSlash - 1;
			}
			lastSlash = index;
			dots = 0;
		} else if (char === "." && dots !== -1) ++dots;
		else dots = -1;
	}
	return res;
}
const isAbsolute = function(p) {
	return _IS_ABSOLUTE_RE.test(p);
};
//#endregion
//#region src/utilities/find-up.ts
const MAX_PATH_SEARCH_DEPTH = 30;
let depth = 0;
/**
* Gets the nearest "node_modules" folder by walking up from start path.
*/
function findFolderUp(startPath, endFileNames = [], endDirectoryNames = []) {
	const _startPath = startPath ?? process.cwd();
	if (endDirectoryNames.some((endDirName) => existsSync(join(_startPath, endDirName)))) return _startPath;
	if (endFileNames.some((endFileName) => existsSync(join(_startPath, endFileName)))) return _startPath;
	if (_startPath !== "/" && depth++ < MAX_PATH_SEARCH_DEPTH) return findFolderUp(join(_startPath, ".."), endFileNames, endDirectoryNames);
}
//#endregion
//#region src/utilities/find-workspace-root.ts
const rootFiles = [
	"storm-workspace.json",
	"storm-workspace.yaml",
	"storm-workspace.yml",
	"storm-workspace.js",
	"storm-workspace.ts",
	".storm-workspace.json",
	".storm-workspace.yaml",
	".storm-workspace.yml",
	".storm-workspace.js",
	".storm-workspace.ts",
	"lerna.json",
	"nx.json",
	"turbo.json",
	"npm-workspace.json",
	"yarn-workspace.json",
	"pnpm-workspace.json",
	"npm-workspace.yaml",
	"yarn-workspace.yaml",
	"pnpm-workspace.yaml",
	"npm-workspace.yml",
	"yarn-workspace.yml",
	"pnpm-workspace.yml",
	"npm-lock.json",
	"yarn-lock.json",
	"pnpm-lock.json",
	"npm-lock.yaml",
	"yarn-lock.yaml",
	"pnpm-lock.yaml",
	"npm-lock.yml",
	"yarn-lock.yml",
	"pnpm-lock.yml",
	"bun.lockb",
	"bun.lock",
	"bunfig.toml"
];
const rootDirectories = [
	".storm-workspace",
	".nx",
	".git",
	".github",
	".vscode",
	".verdaccio"
];
/**
* Find the monorepo root directory, searching upwards from `path`.
*
* @param pathInsideMonorepo - The path inside the monorepo to start searching from
* @returns The monorepo root directory
*/
function findWorkspaceRootSafe(pathInsideMonorepo) {
	if (process.env.STORM_WORKSPACE_ROOT || process.env.NX_WORKSPACE_ROOT_PATH) return correctPaths(process.env.STORM_WORKSPACE_ROOT ?? process.env.NX_WORKSPACE_ROOT_PATH);
	return correctPaths(findFolderUp(pathInsideMonorepo ?? process.cwd(), rootFiles, rootDirectories));
}
/**
* Find the monorepo root directory, searching upwards from `path`.
*
* @param pathInsideMonorepo - The path inside the monorepo to start searching from
* @returns The monorepo root directory
*/
function findWorkspaceRoot(pathInsideMonorepo) {
	const result = findWorkspaceRootSafe(pathInsideMonorepo);
	if (!result) throw new Error(`Cannot find workspace root upwards from known path. Files search list includes: \n${rootFiles.join("\n")}\nPath: ${pathInsideMonorepo ? pathInsideMonorepo : process.cwd()}`);
	return result;
}
//#endregion
//#region src/utilities/get-default-config.ts
/**
* Get the default Storm config values used during various dev-ops processes
*
* @returns The default Storm config values
*/
async function getPackageJsonConfig(root) {
	let license = STORM_DEFAULT_LICENSE;
	let homepage = void 0;
	let support = void 0;
	let name = void 0;
	let namespace = void 0;
	let repository = void 0;
	const workspaceRoot = findWorkspaceRoot(root);
	if (existsSync(join(workspaceRoot, "package.json"))) {
		const file = await readFile(joinPaths(workspaceRoot, "package.json"), "utf8");
		if (file) {
			const packageJson = JSON.parse(file);
			if (packageJson.name) name = packageJson.name;
			if (packageJson.namespace) namespace = packageJson.namespace;
			if (packageJson.repository) {
				if (typeof packageJson.repository === "string") repository = packageJson.repository;
				else if (packageJson.repository.url) repository = packageJson.repository.url;
			}
			if (packageJson.license) license = packageJson.license;
			if (packageJson.homepage) homepage = packageJson.homepage;
			if (packageJson.bugs) {
				if (typeof packageJson.bugs === "string") support = packageJson.bugs;
				else if (packageJson.bugs.url) support = packageJson.bugs.url;
			}
		}
	}
	return {
		workspaceRoot,
		name,
		namespace,
		repository,
		license,
		homepage,
		support
	};
}
/**
* Apply default config values to the given config object
*
* @param config - The config object to apply defaults to
* @returns The config object with defaults applied
*/
function applyDefaultConfig(config) {
	if (!config.support && config.contact) config.support = config.contact;
	if (!config.contact && config.support) config.contact = config.support;
	if (config.homepage) {
		if (!config.docs) config.docs = `${config.homepage}/docs`;
		if (!config.license) config.license = `${config.homepage}/license`;
		if (!config.support) config.support = `${config.homepage}/support`;
		if (!config.contact) config.contact = `${config.homepage}/contact`;
		if (!config.error?.codesFile || !config?.error?.url) {
			config.error ??= { codesFile: STORM_DEFAULT_ERROR_CODES_FILE };
			if (config.homepage) config.error.url ??= `${config.homepage}/errors`;
		}
	}
	return config;
}
//#endregion
//#region src/utilities/process-handler.ts
const exitWithError = (config) => {
	writeFatal("Exiting script with an error status...", config);
	process.exit(1);
};
const exitWithSuccess = (config) => {
	writeSuccess("Script completed successfully. Exiting...", config);
	process.exit(0);
};
const handleProcess = (config) => {
	writeTrace(`Using the following arguments to process the script: ${process.argv.join(", ")}`, config);
	process.on("unhandledRejection", (error) => {
		writeError(`An Unhandled Rejection occurred while running the program: ${error && typeof error === "object" && "message" in error && error?.message ? error.message : typeof error === "string" ? error : "Unknown error"} \nStacktrace: ${error && typeof error === "object" && "stack" in error && error?.stack ? error.stack : ""}`, config);
		exitWithError(config);
	});
	process.on("uncaughtException", (error) => {
		writeError(`An Uncaught Exception occurred while running the program: ${error && typeof error === "object" && "message" in error && error?.message ? error.message : typeof error === "string" ? error : "Unknown error"} \nStacktrace: ${error && typeof error === "object" && "stack" in error && error?.stack ? error.stack : ""}`, config);
		exitWithError(config);
	});
	process.on("SIGTERM", (signal) => {
		writeError(`The program terminated with signal code: ${signal}`, config);
		exitWithError(config);
	});
	process.on("SIGINT", (signal) => {
		writeError(`The program terminated with signal code: ${signal}`, config);
		exitWithError(config);
	});
	process.on("SIGHUP", (signal) => {
		writeError(`The program terminated with signal code: ${signal}`, config);
		exitWithError(config);
	});
};
//#endregion
//#region src/config-file/get-config-file.ts
/**
* Get the config file for the current Storm workspace
*
* @param fileName - The name of the config file to search for
* @param filePath - The path to search for the config file in
* @returns The config file for the current Storm workspace
*/
const getConfigFileByName = async (fileName, filePath, options = {}) => {
	const workspacePath = filePath || findWorkspaceRoot(filePath);
	const configs = await Promise.all([loadConfig({
		cwd: workspacePath,
		packageJson: true,
		name: fileName,
		envName: fileName?.toUpperCase(),
		jitiOptions: {
			debug: false,
			fsCache: process.env.STORM_SKIP_CACHE === "true" ? false : joinPaths(process.env.STORM_CACHE_DIR || "node_modules/.cache/storm", "jiti")
		},
		...options
	}), loadConfig({
		cwd: workspacePath,
		packageJson: true,
		name: fileName,
		envName: fileName?.toUpperCase(),
		jitiOptions: {
			debug: false,
			fsCache: process.env.STORM_SKIP_CACHE === "true" ? false : joinPaths(process.env.STORM_CACHE_DIR || "node_modules/.cache/storm", "jiti")
		},
		configFile: fileName,
		...options
	})]);
	return defu(configs[0] ?? {}, configs[1] ?? {});
};
/**
* Get the config file for the current Storm workspace
*
* @returns The config file for the current Storm workspace
*/
const getConfigFile = async (filePath, additionalFileNames = []) => {
	const workspacePath = filePath ? filePath : findWorkspaceRoot(filePath);
	const result = await getConfigFileByName("storm-workspace", workspacePath);
	let config = result.config;
	const configFile = result.configFile;
	if (config && configFile && Object.keys(config).length > 0 && !config.skipConfigLogging) writeTrace(`Found Storm configuration file "${configFile.includes(`${workspacePath}/`) ? configFile.replace(`${workspacePath}/`, "") : configFile}" at "${workspacePath}"`, { logLevel: "all" });
	if (additionalFileNames && additionalFileNames.length > 0) {
		const results = await Promise.all(additionalFileNames.map((fileName) => getConfigFileByName(fileName, workspacePath)));
		for (const result of results) if (result?.config && result?.configFile && Object.keys(result.config).length > 0) {
			if (!config.skipConfigLogging && !result.config.skipConfigLogging) writeTrace(`Found alternative configuration file "${result.configFile.includes(`${workspacePath}/`) ? result.configFile.replace(`${workspacePath}/`, "") : result.configFile}" at "${workspacePath}"`, { logLevel: "all" });
			config = defu(result.config ?? {}, config ?? {});
		}
	}
	if (!config || Object.keys(config).length === 0) return;
	config.configFile = configFile;
	return config;
};
//#endregion
//#region src/env/get-env.ts
/**
* Get the config for an extension module of Storm workspace from environment variables
*
* @param extensionName - The name of the extension module
* @returns The config for the specified Storm extension module. If the module does not exist, `undefined` is returned.
*/
const getExtensionEnv = (extensionName) => {
	const prefix = `STORM_EXTENSION_${extensionName.toUpperCase()}_`;
	return Object.keys(process.env).filter((key) => key.startsWith(prefix)).reduce((ret, key) => {
		const name = key.replace(prefix, "").split("_").map((i) => i.length > 0 ? i.trim().charAt(0).toUpperCase() + i.trim().slice(1) : "").join("");
		if (name) ret[name] = process.env[key];
		return ret;
	}, {});
};
/**
* Get the config for the current Storm workspace
*
* @returns The config for the current Storm workspace from environment variables
*/
const getConfigEnv = () => {
	const prefix = "STORM_";
	let config = {
		extends: process.env[`${prefix}EXTENDS`] || void 0,
		name: process.env[`${prefix}NAME`] || void 0,
		variant: process.env[`${prefix}VARIANT`] || void 0,
		namespace: process.env[`${prefix}NAMESPACE`] || void 0,
		owner: process.env[`${prefix}OWNER`] || void 0,
		bot: {
			name: process.env[`${prefix}BOT_NAME`] || void 0,
			email: process.env[`${prefix}BOT_EMAIL`] || void 0
		},
		release: {
			banner: {
				url: process.env[`${prefix}RELEASE_BANNER_URL`] || void 0,
				alt: process.env[`${prefix}RELEASE_BANNER_ALT`] || void 0
			},
			header: process.env[`${prefix}RELEASE_HEADER`] || void 0,
			footer: process.env[`${prefix}RELEASE_FOOTER`] || void 0
		},
		error: {
			codesFile: process.env[`${prefix}ERROR_CODES_FILE`] || void 0,
			url: process.env[`${prefix}ERROR_URL`] || void 0
		},
		socials: {
			twitter: process.env[`${prefix}SOCIAL_TWITTER`] || void 0,
			discord: process.env[`${prefix}SOCIAL_DISCORD`] || void 0,
			telegram: process.env[`${prefix}SOCIAL_TELEGRAM`] || void 0,
			slack: process.env[`${prefix}SOCIAL_SLACK`] || void 0,
			medium: process.env[`${prefix}SOCIAL_MEDIUM`] || void 0,
			github: process.env[`${prefix}SOCIAL_GITHUB`] || void 0
		},
		organization: process.env[`${prefix}ORG`] || process.env[`${prefix}ORGANIZATION`] || process.env[`${prefix}ORG_NAME`] || process.env[`${prefix}ORGANIZATION_NAME`] ? process.env[`${prefix}ORG_DESCRIPTION`] || process.env[`${prefix}ORGANIZATION_DESCRIPTION`] || process.env[`${prefix}ORG_URL`] || process.env[`${prefix}ORGANIZATION_URL`] || process.env[`${prefix}ORG_LOGO`] || process.env[`${prefix}ORGANIZATION_LOGO`] ? {
			name: process.env[`${prefix}ORG`] || process.env[`${prefix}ORGANIZATION`] || process.env[`${prefix}ORG_NAME`] || process.env[`${prefix}ORGANIZATION_NAME`],
			description: process.env[`${prefix}ORG_DESCRIPTION`] || process.env[`${prefix}ORGANIZATION_DESCRIPTION`] || void 0,
			url: process.env[`${prefix}ORG_URL`] || process.env[`${prefix}ORGANIZATION_URL`] || void 0,
			logo: process.env[`${prefix}ORG_LOGO`] || process.env[`${prefix}ORGANIZATION_LOGO`] || void 0,
			icon: process.env[`${prefix}ORG_ICON`] || process.env[`${prefix}ORGANIZATION_ICON`] || void 0
		} : process.env[`${prefix}ORG`] || process.env[`${prefix}ORGANIZATION`] || process.env[`${prefix}ORG_NAME`] || process.env[`${prefix}ORGANIZATION_NAME`] : void 0,
		packageManager: process.env[`${prefix}PACKAGE_MANAGER`] || void 0,
		license: process.env[`${prefix}LICENSE`] || void 0,
		homepage: process.env[`${prefix}HOMEPAGE`] || void 0,
		docs: process.env[`${prefix}DOCS`] || void 0,
		portal: process.env[`${prefix}PORTAL`] || void 0,
		licensing: process.env[`${prefix}LICENSING`] || void 0,
		contact: process.env[`${prefix}CONTACT`] || void 0,
		support: process.env[`${prefix}SUPPORT`] || void 0,
		timezone: process.env[`${prefix}TIMEZONE`] || process.env.TZ || void 0,
		locale: process.env[`${prefix}LOCALE`] || process.env.LOCALE || void 0,
		configFile: process.env[`${prefix}WORKSPACE_CONFIG_FILE`] ? correctPaths(process.env[`${prefix}WORKSPACE_CONFIG_FILE`]) : void 0,
		workspaceRoot: process.env[`${prefix}WORKSPACE_ROOT`] ? correctPaths(process.env[`${prefix}WORKSPACE_ROOT`]) : void 0,
		directories: {
			cache: process.env[`${prefix}CACHE_DIR`] ? correctPaths(process.env[`${prefix}CACHE_DIR`]) : process.env[`${prefix}CACHE_DIRECTORY`] ? correctPaths(process.env[`${prefix}CACHE_DIRECTORY`]) : void 0,
			data: process.env[`${prefix}DATA_DIR`] ? correctPaths(process.env[`${prefix}DATA_DIR`]) : process.env[`${prefix}DATA_DIRECTORY`] ? correctPaths(process.env[`${prefix}DATA_DIRECTORY`]) : void 0,
			config: process.env[`${prefix}CONFIG_DIR`] ? correctPaths(process.env[`${prefix}CONFIG_DIR`]) : process.env[`${prefix}CONFIG_DIRECTORY`] ? correctPaths(process.env[`${prefix}CONFIG_DIRECTORY`]) : void 0,
			temp: process.env[`${prefix}TEMP_DIR`] ? correctPaths(process.env[`${prefix}TEMP_DIR`]) : process.env[`${prefix}TEMP_DIRECTORY`] ? correctPaths(process.env[`${prefix}TEMP_DIRECTORY`]) : void 0,
			log: process.env[`${prefix}LOG_DIR`] ? correctPaths(process.env[`${prefix}LOG_DIR`]) : process.env[`${prefix}LOG_DIRECTORY`] ? correctPaths(process.env[`${prefix}LOG_DIRECTORY`]) : void 0,
			build: process.env[`${prefix}BUILD_DIR`] ? correctPaths(process.env[`${prefix}BUILD_DIR`]) : process.env[`${prefix}BUILD_DIRECTORY`] ? correctPaths(process.env[`${prefix}BUILD_DIRECTORY`]) : void 0
		},
		skipCache: process.env[`${prefix}SKIP_CACHE`] !== void 0 ? Boolean(process.env[`${prefix}SKIP_CACHE`]) : void 0,
		mode: (process.env[`${prefix}MODE`] ?? process.env.NODE_ENV ?? process.env.ENVIRONMENT) || void 0,
		repository: process.env[`${prefix}REPOSITORY`] || void 0,
		branch: process.env[`${prefix}BRANCH`] || void 0,
		preid: process.env[`${prefix}PRE_ID`] || void 0,
		registry: {
			github: process.env[`${prefix}REGISTRY_GITHUB`] || void 0,
			npm: process.env[`${prefix}REGISTRY_NPM`] || void 0,
			cargo: process.env[`${prefix}REGISTRY_CARGO`] || void 0,
			cyclone: process.env[`${prefix}REGISTRY_CYCLONE`] || void 0,
			container: process.env[`${prefix}REGISTRY_CONTAINER`] || void 0
		},
		logLevel: process.env[`${prefix}LOG_LEVEL`] !== null && process.env[`${prefix}LOG_LEVEL`] !== void 0 ? process.env[`${prefix}LOG_LEVEL`] && Number.isSafeInteger(Number.parseInt(process.env[`${prefix}LOG_LEVEL`])) ? getLogLevelLabel(Number.parseInt(process.env[`${prefix}LOG_LEVEL`])) : process.env[`${prefix}LOG_LEVEL`] : void 0,
		skipConfigLogging: process.env[`${prefix}SKIP_CONFIG_LOGGING`] !== void 0 ? Boolean(process.env[`${prefix}SKIP_CONFIG_LOGGING`]) : void 0
	};
	const themeNames = Object.keys(process.env).filter((envKey) => envKey.startsWith(`${prefix}COLOR_`) && COLOR_KEYS.every((colorKey) => !envKey.startsWith(`${prefix}COLOR_LIGHT_${colorKey}`) && !envKey.startsWith(`${prefix}COLOR_DARK_${colorKey}`)));
	config.colors = themeNames.length > 0 ? themeNames.reduce((ret, themeName) => {
		ret[themeName] = getThemeColorsEnv(prefix, themeName);
		return ret;
	}, {}) : getThemeColorsEnv(prefix);
	if (config.docs === STORM_DEFAULT_DOCS) {
		if (config.homepage === STORM_DEFAULT_HOMEPAGE) config.docs = `${STORM_DEFAULT_HOMEPAGE}/projects/${config.name}/docs`;
		else config.docs = `${config.homepage}/docs`;
	}
	if (config.licensing === STORM_DEFAULT_LICENSING) {
		if (config.homepage === STORM_DEFAULT_HOMEPAGE) config.licensing = `${STORM_DEFAULT_HOMEPAGE}/projects/${config.name}/licensing`;
		else config.licensing = `${config.homepage}/docs`;
	}
	const serializedConfig = process.env[`${prefix}WORKSPACE_CONFIG`];
	if (serializedConfig) {
		const parsed = JSON.parse(serializedConfig);
		config = {
			...config,
			...parsed,
			colors: {
				...config.colors,
				...parsed.colors
			},
			extensions: {
				...config.extensions,
				...parsed.extensions
			}
		};
	}
	return config;
};
const getThemeColorsEnv = (prefix, theme) => {
	const themeName = `COLOR_${theme && theme !== "base" ? `${theme}_` : ""}`.toUpperCase();
	return process.env[`${prefix}${themeName}LIGHT_BRAND`] || process.env[`${prefix}${themeName}DARK_BRAND`] ? getMultiThemeColorsEnv(prefix + themeName) : getSingleThemeColorsEnv(prefix + themeName);
};
const getSingleThemeColorsEnv = (prefix) => {
	const gradient = [];
	if (process.env[`${prefix}GRADIENT_START`] && process.env[`${prefix}GRADIENT_END`]) gradient.push(process.env[`${prefix}GRADIENT_START`], process.env[`${prefix}GRADIENT_END`]);
	else if (process.env[`${prefix}GRADIENT_0`] || process.env[`${prefix}GRADIENT_1`]) {
		let index = process.env[`${prefix}GRADIENT_0`] ? 0 : 1;
		while (process.env[`${prefix}GRADIENT_${index}`]) {
			gradient.push(process.env[`${prefix}GRADIENT_${index}`]);
			index++;
		}
	}
	return {
		dark: process.env[`${prefix}DARK`],
		light: process.env[`${prefix}LIGHT`],
		brand: process.env[`${prefix}BRAND`],
		alternate: process.env[`${prefix}ALTERNATE`],
		accent: process.env[`${prefix}ACCENT`],
		link: process.env[`${prefix}LINK`],
		discovery: process.env[`${prefix}DISCOVERY`],
		success: process.env[`${prefix}SUCCESS`],
		info: process.env[`${prefix}INFO`],
		debug: process.env[`${prefix}DEBUG`],
		warning: process.env[`${prefix}WARNING`],
		danger: process.env[`${prefix}DANGER`],
		fatal: process.env[`${prefix}FATAL`],
		performance: process.env[`${prefix}PERFORMANCE`],
		positive: process.env[`${prefix}POSITIVE`],
		negative: process.env[`${prefix}NEGATIVE`],
		gradient
	};
};
const getMultiThemeColorsEnv = (prefix) => {
	return {
		light: getBaseThemeColorsEnv(`${prefix}_LIGHT_`),
		dark: getBaseThemeColorsEnv(`${prefix}_DARK_`)
	};
};
const getBaseThemeColorsEnv = (prefix) => {
	const gradient = [];
	if (process.env[`${prefix}GRADIENT_START`] && process.env[`${prefix}GRADIENT_END`]) gradient.push(process.env[`${prefix}GRADIENT_START`], process.env[`${prefix}GRADIENT_END`]);
	else if (process.env[`${prefix}GRADIENT_0`] || process.env[`${prefix}GRADIENT_1`]) {
		let index = process.env[`${prefix}GRADIENT_0`] ? 0 : 1;
		while (process.env[`${prefix}GRADIENT_${index}`]) {
			gradient.push(process.env[`${prefix}GRADIENT_${index}`]);
			index++;
		}
	}
	return {
		foreground: process.env[`${prefix}FOREGROUND`],
		background: process.env[`${prefix}BACKGROUND`],
		brand: process.env[`${prefix}BRAND`],
		alternate: process.env[`${prefix}ALTERNATE`],
		accent: process.env[`${prefix}ACCENT`],
		link: process.env[`${prefix}LINK`],
		discovery: process.env[`${prefix}DISCOVERY`],
		success: process.env[`${prefix}SUCCESS`],
		info: process.env[`${prefix}INFO`],
		debug: process.env[`${prefix}DEBUG`],
		warning: process.env[`${prefix}WARNING`],
		danger: process.env[`${prefix}DANGER`],
		fatal: process.env[`${prefix}FATAL`],
		performance: process.env[`${prefix}PERFORMANCE`],
		positive: process.env[`${prefix}POSITIVE`],
		negative: process.env[`${prefix}NEGATIVE`],
		gradient
	};
};
//#endregion
//#region src/env/set-env.ts
/**
* Get the config for an extension module of Storm workspace from environment variables
*
* @param extensionName - The name of the extension module
* @returns The config for the specified Storm extension module. If the module does not exist, `undefined` is returned.
*/
const setExtensionEnv = (extensionName, extension) => {
	for (const key of Object.keys(extension ?? {})) if (extension[key]) {
		const result = key?.replace(/([A-Z])+/g, (input) => input ? input[0]?.toUpperCase() + input.slice(1) : "").split(/(?=[A-Z])|[.\-\s_]/).map((x) => x.toLowerCase()) ?? [];
		let extensionKey;
		if (result.length === 0) return;
		if (result.length === 1) extensionKey = result[0]?.toUpperCase() ?? "";
		else extensionKey = result.reduce((ret, part) => {
			return `${ret}_${part.toLowerCase()}`;
		});
		process.env[`STORM_EXTENSION_${extensionName.toUpperCase()}_${extensionKey.toUpperCase()}`] = extension[key];
	}
};
/**
* Get the config for the current Storm workspace
*
* @returns The config for the current Storm workspace from environment variables
*/
const setConfigEnv = (config) => {
	const prefix = "STORM_";
	if (config.extends) process.env[`${prefix}EXTENDS`] = Array.isArray(config.extends) ? JSON.stringify(config.extends) : config.extends;
	if (config.name) process.env[`${prefix}NAME`] = config.name;
	if (config.variant) process.env[`${prefix}VARIANT`] = config.variant;
	if (config.namespace) process.env[`${prefix}NAMESPACE`] = config.namespace;
	if (config.owner) process.env[`${prefix}OWNER`] = config.owner;
	if (config.bot) {
		process.env[`${prefix}BOT_NAME`] = config.bot.name;
		process.env[`${prefix}BOT_EMAIL`] = config.bot.email;
	}
	if (config.error) {
		process.env[`${prefix}ERROR_CODES_FILE`] = config.error.codesFile;
		process.env[`${prefix}ERROR_URL`] = config.error.url;
	}
	if (config.release) {
		if (config.release.banner) {
			if (typeof config.release.banner === "string") {
				process.env[`${prefix}RELEASE_BANNER`] = config.release.banner;
				process.env[`${prefix}RELEASE_BANNER_URL`] = config.release.banner;
			} else {
				process.env[`${prefix}RELEASE_BANNER`] = config.release.banner.url;
				process.env[`${prefix}RELEASE_BANNER_URL`] = config.release.banner.url;
				process.env[`${prefix}RELEASE_BANNER_ALT`] = config.release.banner.alt;
			}
		}
		process.env[`${prefix}RELEASE_HEADER`] = config.release.header;
		process.env[`${prefix}RELEASE_FOOTER`] = config.release.footer;
	}
	if (config.socials) {
		if (config.socials.twitter) process.env[`${prefix}SOCIAL_TWITTER`] = config.socials.twitter;
		if (config.socials.discord) process.env[`${prefix}SOCIAL_DISCORD`] = config.socials.discord;
		if (config.socials.telegram) process.env[`${prefix}SOCIAL_TELEGRAM`] = config.socials.telegram;
		if (config.socials.slack) process.env[`${prefix}SOCIAL_SLACK`] = config.socials.slack;
		if (config.socials.medium) process.env[`${prefix}SOCIAL_MEDIUM`] = config.socials.medium;
		if (config.socials.github) process.env[`${prefix}SOCIAL_GITHUB`] = config.socials.github;
	}
	if (config.organization) {
		if (typeof config.organization === "string") {
			process.env[`${prefix}ORG`] = config.organization;
			process.env[`${prefix}ORG_NAME`] = config.organization;
			process.env[`${prefix}ORGANIZATION`] = config.organization;
			process.env[`${prefix}ORGANIZATION_NAME`] = config.organization;
		} else {
			process.env[`${prefix}ORG`] = config.organization.name;
			process.env[`${prefix}ORG_NAME`] = config.organization.name;
			process.env[`${prefix}ORGANIZATION`] = config.organization.name;
			process.env[`${prefix}ORGANIZATION_NAME`] = config.organization.name;
			if (config.organization.url) {
				process.env[`${prefix}ORG_URL`] = config.organization.url;
				process.env[`${prefix}ORGANIZATION_URL`] = config.organization.url;
			}
			if (config.organization.description) {
				process.env[`${prefix}ORG_DESCRIPTION`] = config.organization.description;
				process.env[`${prefix}ORGANIZATION_DESCRIPTION`] = config.organization.description;
			}
			if (config.organization.logo) {
				process.env[`${prefix}ORG_LOGO`] = config.organization.logo;
				process.env[`${prefix}ORGANIZATION_LOGO`] = config.organization.logo;
			}
			if (config.organization.icon) {
				process.env[`${prefix}ORG_ICON`] = config.organization.icon;
				process.env[`${prefix}ORGANIZATION_ICON`] = config.organization.icon;
			}
		}
	}
	if (config.packageManager) process.env[`${prefix}PACKAGE_MANAGER`] = config.packageManager;
	if (config.license) process.env[`${prefix}LICENSE`] = config.license;
	if (config.homepage) process.env[`${prefix}HOMEPAGE`] = config.homepage;
	if (config.docs) process.env[`${prefix}DOCS`] = config.docs;
	if (config.portal) process.env[`${prefix}PORTAL`] = config.portal;
	if (config.licensing) process.env[`${prefix}LICENSING`] = config.licensing;
	if (config.contact) process.env[`${prefix}CONTACT`] = config.contact;
	if (config.support) process.env[`${prefix}SUPPORT`] = config.support;
	if (config.timezone) {
		process.env[`${prefix}TIMEZONE`] = config.timezone;
		process.env.TZ = config.timezone;
		process.env.DEFAULT_TIMEZONE = config.timezone;
		process.env.TIMEZONE = config.timezone;
	}
	if (config.locale) {
		process.env[`${prefix}LOCALE`] = config.locale;
		process.env.DEFAULT_LOCALE = config.locale;
		process.env.LOCALE = config.locale;
		process.env.LANG = config.locale ? `${config.locale.replaceAll("-", "_")}.UTF-8` : "en_US.UTF-8";
	}
	if (config.configFile) process.env[`${prefix}WORKSPACE_CONFIG_FILE`] = correctPaths(config.configFile);
	if (config.workspaceRoot) {
		process.env[`${prefix}WORKSPACE_ROOT`] = correctPaths(config.workspaceRoot);
		process.env.NX_WORKSPACE_ROOT = correctPaths(config.workspaceRoot);
		process.env.NX_WORKSPACE_ROOT_PATH = correctPaths(config.workspaceRoot);
	}
	if (config.directories) {
		if (!config.skipCache && config.directories.cache) {
			process.env[`${prefix}CACHE_DIR`] = correctPaths(config.directories.cache);
			process.env[`${prefix}CACHE_DIRECTORY`] = process.env[`${prefix}CACHE_DIR`];
		}
		if (config.directories.data) {
			process.env[`${prefix}DATA_DIR`] = correctPaths(config.directories.data);
			process.env[`${prefix}DATA_DIRECTORY`] = process.env[`${prefix}DATA_DIR`];
		}
		if (config.directories.config) {
			process.env[`${prefix}CONFIG_DIR`] = correctPaths(config.directories.config);
			process.env[`${prefix}CONFIG_DIRECTORY`] = process.env[`${prefix}CONFIG_DIR`];
		}
		if (config.directories.temp) {
			process.env[`${prefix}TEMP_DIR`] = correctPaths(config.directories.temp);
			process.env[`${prefix}TEMP_DIRECTORY`] = process.env[`${prefix}TEMP_DIR`];
		}
		if (config.directories.log) {
			process.env[`${prefix}LOG_DIR`] = correctPaths(config.directories.log);
			process.env[`${prefix}LOG_DIRECTORY`] = process.env[`${prefix}LOG_DIR`];
		}
		if (config.directories.build) {
			process.env[`${prefix}BUILD_DIR`] = correctPaths(config.directories.build);
			process.env[`${prefix}BUILD_DIRECTORY`] = process.env[`${prefix}BUILD_DIR`];
		}
	}
	if (config.skipCache !== void 0) {
		process.env[`${prefix}SKIP_CACHE`] = String(config.skipCache);
		if (config.skipCache) {
			process.env.NX_SKIP_NX_CACHE ??= String(config.skipCache);
			process.env.NX_CACHE_PROJECT_GRAPH ??= String(config.skipCache);
		}
	}
	if (config.mode) {
		process.env[`${prefix}MODE`] = config.mode;
		process.env.NODE_ENV = config.mode;
		process.env.ENVIRONMENT = config.mode;
	}
	if (config.colors?.base?.light || config.colors?.base?.dark) for (const key of Object.keys(config.colors)) setThemeColorsEnv(`${prefix}COLOR_${key}_`, config.colors[key]);
	else setThemeColorsEnv(`${prefix}COLOR_`, config.colors);
	if (config.repository) process.env[`${prefix}REPOSITORY`] = config.repository;
	if (config.branch) process.env[`${prefix}BRANCH`] = config.branch;
	if (config.preid) process.env[`${prefix}PRE_ID`] = String(config.preid);
	if (config.registry) {
		if (config.registry.github) process.env[`${prefix}REGISTRY_GITHUB`] = String(config.registry.github);
		if (config.registry.npm) process.env[`${prefix}REGISTRY_NPM`] = String(config.registry.npm);
		if (config.registry.cargo) process.env[`${prefix}REGISTRY_CARGO`] = String(config.registry.cargo);
		if (config.registry.cyclone) process.env[`${prefix}REGISTRY_CYCLONE`] = String(config.registry.cyclone);
		if (config.registry.container) process.env[`${prefix}REGISTRY_CONTAINER`] = String(config.registry.container);
	}
	if (config.logLevel) {
		process.env[`${prefix}LOG_LEVEL`] = String(config.logLevel);
		process.env.LOG_LEVEL = String(config.logLevel);
		process.env.NX_VERBOSE_LOGGING = String(getLogLevel(config.logLevel) >= LogLevel.DEBUG ? true : false);
		process.env.RUST_BACKTRACE = getLogLevel(config.logLevel) >= LogLevel.DEBUG ? "full" : "none";
	}
	if (config.skipConfigLogging !== void 0) process.env[`${prefix}SKIP_CONFIG_LOGGING`] = String(config.skipConfigLogging);
	process.env[`${prefix}WORKSPACE_CONFIG`] = JSON.stringify(config);
	for (const key of Object.keys(config.extensions ?? {})) if (config.extensions[key] && Object.keys(config.extensions[key])) setExtensionEnv(key, config.extensions[key]);
};
const setThemeColorsEnv = (prefix, config) => {
	return config?.light?.brand || config?.dark?.brand ? setMultiThemeColorsEnv(prefix, config) : setSingleThemeColorsEnv(prefix, config);
};
const setSingleThemeColorsEnv = (prefix, config) => {
	if (config.dark) process.env[`${prefix}DARK`] = config.dark;
	if (config.light) process.env[`${prefix}LIGHT`] = config.light;
	if (config.brand) process.env[`${prefix}BRAND`] = config.brand;
	if (config.alternate) process.env[`${prefix}ALTERNATE`] = config.alternate;
	if (config.accent) process.env[`${prefix}ACCENT`] = config.accent;
	if (config.link) process.env[`${prefix}LINK`] = config.link;
	if (config.discovery) process.env[`${prefix}DISCOVERY`] = config.discovery;
	if (config.success) process.env[`${prefix}SUCCESS`] = config.success;
	if (config.info) process.env[`${prefix}INFO`] = config.info;
	if (config.debug) process.env[`${prefix}DEBUG`] = config.debug;
	if (config.warning) process.env[`${prefix}WARNING`] = config.warning;
	if (config.danger) process.env[`${prefix}DANGER`] = config.danger;
	if (config.fatal) process.env[`${prefix}FATAL`] = config.fatal;
	if (config.performance) process.env[`${prefix}PERFORMANCE`] = config.performance;
	if (config.positive) process.env[`${prefix}POSITIVE`] = config.positive;
	if (config.negative) process.env[`${prefix}NEGATIVE`] = config.negative;
	if (config.gradient) for (let i = 0; i < config.gradient.length; i++) process.env[`${prefix}GRADIENT_${i}`] = config.gradient[i];
};
const setMultiThemeColorsEnv = (prefix, config) => {
	return {
		light: setBaseThemeColorsEnv(`${prefix}LIGHT_`, config.light),
		dark: setBaseThemeColorsEnv(`${prefix}DARK_`, config.dark)
	};
};
const setBaseThemeColorsEnv = (prefix, config) => {
	if (config.foreground) process.env[`${prefix}FOREGROUND`] = config.foreground;
	if (config.background) process.env[`${prefix}BACKGROUND`] = config.background;
	if (config.brand) process.env[`${prefix}BRAND`] = config.brand;
	if (config.alternate) process.env[`${prefix}ALTERNATE`] = config.alternate;
	if (config.accent) process.env[`${prefix}ACCENT`] = config.accent;
	if (config.link) process.env[`${prefix}LINK`] = config.link;
	if (config.discovery) process.env[`${prefix}DISCOVERY`] = config.discovery;
	if (config.success) process.env[`${prefix}SUCCESS`] = config.success;
	if (config.info) process.env[`${prefix}INFO`] = config.info;
	if (config.debug) process.env[`${prefix}DEBUG`] = config.debug;
	if (config.warning) process.env[`${prefix}WARNING`] = config.warning;
	if (config.danger) process.env[`${prefix}DANGER`] = config.danger;
	if (config.fatal) process.env[`${prefix}FATAL`] = config.fatal;
	if (config.performance) process.env[`${prefix}PERFORMANCE`] = config.performance;
	if (config.positive) process.env[`${prefix}POSITIVE`] = config.positive;
	if (config.negative) process.env[`${prefix}NEGATIVE`] = config.negative;
	if (config.gradient) for (let i = 0; i < config.gradient.length; i++) process.env[`${prefix}GRADIENT_${i}`] = config.gradient[i];
};
//#endregion
//#region src/create-storm-config.ts
const _extension_cache = /* @__PURE__ */ new WeakMap();
let _static_cache = void 0;
/**
* Get the config for the current Storm workspace
*
* @param extensionName - The name of the config extension
* @param schema - The schema for the config extension
* @param workspaceRoot - The root directory of the workspace
* @param skipLogs - Skip writing logs to the console
* @param useDefault - Whether to use the default config if no config file is found
* @returns The config for the current Storm workspace
*/
const createStormWorkspaceConfig = async (extensionName, schema, workspaceRoot, skipLogs = false, useDefault = true) => {
	let result;
	if (!_static_cache?.data || !_static_cache?.timestamp || _static_cache.timestamp < Date.now() - 8e3) {
		let _workspaceRoot = workspaceRoot;
		if (!_workspaceRoot) _workspaceRoot = findWorkspaceRoot();
		const configEnv = getConfigEnv();
		const configFile = await getConfigFile(_workspaceRoot);
		if (!configFile) {
			if (!skipLogs) writeWarning("No Storm Workspace configuration file found in the current repository. Please ensure this is the expected behavior - you can add a `storm-workspace.json` file to the root of your workspace if it is not.\n", { logLevel: "all" });
			if (useDefault === false) return;
		}
		const defaultConfig = await getPackageJsonConfig(_workspaceRoot);
		const configInput = defu(configEnv, configFile, defaultConfig);
		if (!configInput.variant) configInput.variant = existsSync(joinPaths(_workspaceRoot, "nx.json")) || existsSync(joinPaths(_workspaceRoot, ".nx")) || existsSync(joinPaths(_workspaceRoot, "lerna.json")) || existsSync(joinPaths(_workspaceRoot, "turbo.json")) ? "monorepo" : "minimal";
		try {
			result = applyDefaultConfig((await Promise.resolve(workspaceConfigSchema._zod.parse({
				value: configInput,
				issues: []
			}, { async: true }))).value);
			result.workspaceRoot ??= _workspaceRoot;
		} catch (error) {
			throw new Error(`Failed to parse Storm Workspace configuration${error?.message ? `: ${error.message}` : ""}

Please ensure your configuration file is valid JSON and matches the expected schema. The current workspace configuration input is: ${formatLogMessage(configInput)}`, { cause: error });
		}
	} else result = _static_cache.data;
	if (schema && extensionName) result.extensions = {
		...result.extensions,
		[extensionName]: createConfigExtension(extensionName, schema)
	};
	_static_cache = {
		timestamp: Date.now(),
		data: result
	};
	return result;
};
/**
* Get the config for a specific Storm config Extension
*
* @param extensionName - The name of the config extension
* @param options - The options for the config extension
* @returns The config for the specified Storm config extension. If the extension does not exist, `undefined` is returned.
*/
const createConfigExtension = (extensionName, schema) => {
	const extension_cache_key = { extensionName };
	if (_extension_cache.has(extension_cache_key)) return _extension_cache.get(extension_cache_key);
	let extension = getExtensionEnv(extensionName);
	if (schema) extension = schema.parse(extension);
	_extension_cache.set(extension_cache_key, extension);
	return extension;
};
/**
* Load the config file values for the current Storm workspace into environment variables
*
* @param workspaceRoot - The root directory of the workspace
* @param skipLogs - Skip writing logs to the console
* @returns The config for the current Storm workspace, throws an error if the config file could not be loaded
*/
const loadStormWorkspaceConfig = async (workspaceRoot, skipLogs = false) => {
	const config = await createStormWorkspaceConfig(void 0, void 0, workspaceRoot, skipLogs, true);
	setConfigEnv(config);
	if (!skipLogs && !config.skipConfigLogging) writeTrace(`⚙️  Using Storm Workspace configuration: \n${formatLogMessage(config)}`, config);
	return config;
};
//#endregion
//#region src/get-config.ts
/**
* Get the config for the current Storm workspace
*
* @param workspaceRoot - The root directory of the workspace
* @param skipLogs - Skip writing logs to the console
* @returns The config for the current Storm workspace
*/
function getConfig(workspaceRoot, skipLogs = false) {
	return loadStormWorkspaceConfig(workspaceRoot, skipLogs);
}
//#endregion
//#region bin/config.ts
function createProgram() {
	writeInfo(`${brandIcon()} Running Storm Configuration Tools`, { logLevel: "all" });
	const root = findWorkspaceRootSafe(process.cwd());
	process.env.STORM_WORKSPACE_ROOT ??= root;
	process.env.NX_WORKSPACE_ROOT_PATH ??= root;
	if (root) process.chdir(root);
	const program = new Command("storm-config");
	program.version("1.0.0", "-v --version", "display CLI version");
	program.command("view", { isDefault: true }).description("View the current Storm configuration for the workspace.").option("-d --dir <path>", "A directory that exists inside the workspace root", process.cwd()).action(viewAction);
	return program;
}
async function viewAction({ dir }) {
	writeInfo(`🔍   Searching for Storm configuration for the workspace at "${dir}"...`, { logLevel: "all" });
	const config = await getConfig(findWorkspaceRootSafe(dir), true);
	if (config) writeSuccess(`The following Storm configuration values have been found for this repository:

${formatLogMessage({
		...config,
		colors: void 0
	})}

${typeof config.colors.light === "string" ? formatSingleThemeColors(config.colors) : formatMultiThemeColors(config.colors)}
`, {
		...config,
		logLevel: "all"
	});
	else writeError("No Storm config file found in the current workspace. Please ensure this is the expected behavior - you can add a `storm.json` file to the root of your workspace if it is not.\n", { logLevel: "all" });
}
(async () => {
	try {
		handleProcess();
		await createProgram().parseAsync(process.argv);
		exitWithSuccess();
	} catch (error) {
		writeFatal(`A fatal error occurred while running the Storm Git tool:
${error?.message ? error.message : JSON.stringify(error)}${error?.stack ? `
Stack Trace: ${error.stack}` : ""}`, { logLevel: "all" });
		exitWithError();
		process.exit(1);
	}
})();
const formatSingleThemeColors = (config) => {
	return `---- Theme Colors ----
  ${Object.entries(config).filter(([key, value]) => key !== "gradient" && typeof value === "string" && value.length > 0).map(([key, value]) => chalk.hex(String(value))(`${key}: ${chalk.bold(value)}`)).join(" \n")}
`;
};
const formatMultiThemeColors = (config) => {
	return ` ---- Light Theme Colors ----
${Object.entries(config.light).filter(([key, value]) => key !== "gradient" && typeof value === "string" && value.length > 0).map(([key, value]) => chalk.hex(String(value))(`${key}: ${chalk.bold(value)}`)).join(" \n")}

---- Dark Theme Colors ----
${Object.entries(config.dark).filter(([key, value]) => key !== "gradient" && typeof value === "string" && value.length > 0).map(([key, value]) => chalk.hex(String(value))(`${key}: ${chalk.bold(value)}`)).join(" \n")}
  `;
};
//#endregion
export { createProgram, viewAction };
