import { Uri } from "vscode";
export declare function getWorkspaceRoot(): Promise<Uri | undefined>;
export declare function getWorkspaceRootPath(): Uri | undefined;
export declare function getTargetGuideMardown(): Promise<Uri>;
export declare function writeResponseToFile(response: string, appName: string, selectedProject: string): Promise<Uri>;
export declare function readResponseFromFile(uri: Uri): Promise<Uint8Array>;
export declare function isLlmApiReady(): boolean;
