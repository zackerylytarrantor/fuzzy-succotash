"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLlmApiReady = exports.readResponseFromFile = exports.writeResponseToFile = exports.getTargetGuideMardown = exports.getWorkspaceRootPath = exports.getWorkspaceRoot = void 0;
const path_1 = __importDefault(require("path"));
const vscode_1 = require("vscode");
const fs_1 = __importDefault(require("fs"));
const semver_1 = require("semver");
function getWorkspaceRoot() {
    return __awaiter(this, void 0, void 0, function* () {
        if (vscode_1.workspace.workspaceFolders && vscode_1.workspace.workspaceFolders.length) {
            if (vscode_1.workspace.workspaceFolders.length === 1) {
                return vscode_1.workspace.workspaceFolders[0].uri;
            }
            else {
                return yield vscode_1.window.showQuickPick(vscode_1.workspace.workspaceFolders.map((c) => ({ value: c.uri, label: getRelativePathToWorkspaceFolder(c.uri), description: getWorkspaceFolderName(c.uri) })), { placeHolder: "Select the target project." }).then(res => res && res.value);
            }
        }
    });
}
exports.getWorkspaceRoot = getWorkspaceRoot;
function getWorkspaceRootPath() {
    if (vscode_1.workspace.workspaceFolders && vscode_1.workspace.workspaceFolders.length) {
        return vscode_1.workspace.workspaceFolders[0].uri;
    }
}
exports.getWorkspaceRootPath = getWorkspaceRootPath;
function getRelativePathToWorkspaceFolder(file) {
    if (file) {
        const wf = vscode_1.workspace.getWorkspaceFolder(file);
        if (wf) {
            return path_1.default.relative(wf.uri.fsPath, file.fsPath);
        }
    }
    return '';
}
function getWorkspaceFolderName(file) {
    if (file) {
        const wf = vscode_1.workspace.getWorkspaceFolder(file);
        if (wf) {
            return wf.name;
        }
    }
    return '';
}
function getTargetGuideMardown() {
    return __awaiter(this, void 0, void 0, function* () {
        if (vscode_1.window.activeTextEditor) {
            const activeUri = vscode_1.window.activeTextEditor.document.uri;
            if (/README-\S+.md/.test(path_1.default.basename(activeUri.path).toLowerCase())) {
                return activeUri;
            }
        }
        const candidates = yield vscode_1.workspace.findFiles("**/README-*.md");
        if (candidates.length > 0) {
            if (candidates.length === 1) {
                return candidates[0];
            }
            else {
                return yield vscode_1.window.showQuickPick(candidates.map((c) => ({ value: c, label: getRelativePathToWorkspaceFolder(c), description: getWorkspaceFolderName(c) })), { placeHolder: "Select the target project." }).then(res => res && res.value);
            }
        }
        return undefined;
    });
}
exports.getTargetGuideMardown = getTargetGuideMardown;
function writeResponseToFile(response, appName, selectedProject) {
    return __awaiter(this, void 0, void 0, function* () {
        const readmeFilePath = path_1.default.resolve(selectedProject, `README-ai-${appName}.md`);
        if (fs_1.default.existsSync(readmeFilePath)) {
            try {
                fs_1.default.unlinkSync(readmeFilePath);
            }
            catch (ex) {
                throw new Error(`Could not delete readme file: ${readmeFilePath}, ${ex}`);
            }
        }
        try {
            fs_1.default.writeFileSync(readmeFilePath, response);
            return vscode_1.Uri.file(readmeFilePath);
        }
        catch (ex) {
            throw new Error(`Could not write readme file: ${readmeFilePath}, ${ex}`);
        }
    });
}
exports.writeResponseToFile = writeResponseToFile;
function readResponseFromFile(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        return vscode_1.workspace.fs.readFile(uri);
    });
}
exports.readResponseFromFile = readResponseFromFile;
function isLlmApiReady() {
    return vscode_1.version.includes('insider') && new semver_1.SemVer(vscode_1.version).compare(new semver_1.SemVer("1.90.0-insider")) >= 0;
}
exports.isLlmApiReady = isLlmApiReady;
//# sourceMappingURL=util.js.map