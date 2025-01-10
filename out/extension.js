"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
function activate(context) {
    console.log('------------------------------------------------------');
    console.log('TS BackEnd Starter is now active!');
    console.log('09/01/2025');
    console.log('KramelWorks - Gilson Zacarias');
    console.log('------------------------------------------------------');
    const disposable = vscode.commands.registerCommand('TS-BackEnd-Starter.createProject', async () => {
        vscode.window.showInformationMessage('TS BackEnd Starter!');
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('Inválid WorkSpace!');
            return;
        }
        const projectName = await vscode.window.showInputBox({
            prompt: 'Project name',
            value: 'my-project',
        });
        if (!projectName) {
            vscode.window.showErrorMessage('Project name is needed.');
            return;
        }
        const projectFolder = path.join(workspaceFolder, projectName);
        const srcFolder = path.join(projectFolder, 'src');
        try {
            checkNpmInstallation();
            createFolderStructure(srcFolder);
            createFiles(srcFolder);
            await installDependencies(projectFolder);
            vscode.window.showInformationMessage('Success!');
            console.log("Success!");
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error: ${error.message}`);
            console.log(`Error: ${error.message}`);
        }
        function checkNpmInstallation() {
            return new Promise((resolve, reject) => {
                (0, child_process_1.exec)('npm --version', (error, stdout) => {
                    if (error) {
                        reject('NPM not found');
                    }
                    else {
                        console.log(`NPM version ${stdout.trim()} found.`);
                        resolve();
                    }
                });
            });
        }
        function createFolderStructure(basePath) {
            const folders = [
                'api/controllers',
                'api/routes',
                'api/middlewares',
                'application/interfaces',
                'application/services',
                'application/dtos',
                'domain/validators',
                'domain/models',
                'domain/enum',
                'infrastructure/database',
                'infrastructure/database/interfaces',
                'infrastructure/database/migrations',
                'infrastructure/database/repositories',
                'infrastructure/database/config',
                'infrastructure/storage/interfaces',
                'infrastructure/storage/migrations',
                'infrastructure/storage/repositories',
                'infrastructure/email/interfaces',
                'infrastructure/email/models',
                'infrastructure/email/services',
                'utils/helpers',
                'config'
            ];
            folders.forEach(folder => {
                const folderPath = path.join(basePath, `${projectName}.${folder}`);
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath, { recursive: true });
                    console.log(`${folderPath} - [OK]`);
                }
            });
            vscode.window.showInformationMessage('Folders created!');
        }
        function createFiles(basePath) {
            const files = [
                { path: '.env', content: '' },
                { path: 'app.ts', content: 'import express from "express";\nimport cors from "cors";\n\n\n\n\nconst app = express();\n\n\n\n\napp.use(cors());\n\n\n\n\nexport default app;' },
                { path: 'server.ts', content: 'import app from "./app";\n\n\n\n\nconst port = 3000;\napp.listen(port, () => console.log(`Server running on port ${port}`));' },
                { path: 'index.ts', content: 'import app from "./app";\n\n\n\n\nexport default app;' },
                { path: `${projectName}.config/config.ts`, content: 'import * as dotenv from "dotenv";\n\n\n\n\ndotenv.config();\n\n\n\n\nexport default { port: process.env.PORT || 3000 };' },
                { path: `${projectName}.api/routes/routes.ts`, content: 'import express, { Request, Response } from "express";\n\n\n\n\nconst router = express.Router(); \n\n // Definição das rotas\nrouter.get("/",(req: Request, res: Response)=>\n{\nres.send("Api Running...");\n});\n\n\n\n\nexport default router;' }
            ];
            files.forEach(file => {
                const filePath = path.join(basePath, file.path);
                if (!fs.existsSync(filePath)) {
                    fs.writeFileSync(filePath, file.content);
                    console.log(`${filePath} - [OK]`);
                }
            });
            vscode.window.showInformationMessage('Files created!');
        }
        function installDependencies(projectFolder) {
            return new Promise((resolve, reject) => {
                (0, child_process_1.exec)('npm init -y && npm install express dotenv cors', { cwd: projectFolder }, (error, stdout, stderr) => {
                    if (error) {
                        reject(`Erro ao instalar dependências: ${stderr}`);
                    }
                    else {
                        resolve();
                    }
                });
                vscode.window.showInformationMessage(`Project: ${projectName} - [Initialization]`);
            });
        }
    });
    // Criar o comando de controller
    const disposableController = vscode.commands.registerCommand('TS-BackEnd-Starter.createController', async (uri) => {
        const fileName = await vscode.window.showInputBox({ prompt: 'Controller name' });
        if (!fileName)
            return;
        const filePath = path.join(uri.fsPath, `${fileName}Controller.ts`);
        const fileContent = `import { Request, Response } from 'express';\n\n\n\n\nexport class ${fileName}Controller {\n\n\n  public async get(req: Request, res: Response): Promise<void> {\n    res.send('${fileName} controller');\n  }\n}`;
        fs.writeFileSync(filePath, fileContent);
        vscode.window.showInformationMessage(`${fileName}Controller.ts created!`);
    });
    // Criar o comando de interface
    const disposableInterface = vscode.commands.registerCommand('TS-BackEnd-Starter.createInterface', async (uri) => {
        const fileName = await vscode.window.showInputBox({ prompt: 'Interface name' });
        if (!fileName)
            return;
        const filePath = path.join(uri.fsPath, `I${fileName}.ts`);
        const fileContent = `export interface I${fileName}{\n\n}`;
        fs.writeFileSync(filePath, fileContent);
        vscode.window.showInformationMessage(`I${fileName}.ts created!`);
    });
    // Criar o comando de class
    const disposableClass = vscode.commands.registerCommand('TS-BackEnd-Starter.createClass', async (uri) => {
        const fileName = await vscode.window.showInputBox({ prompt: 'Class name' });
        if (!fileName)
            return;
        const filePath = path.join(uri.fsPath, `${fileName}.ts`);
        const fileContent = `export class ${fileName}{\nconstructor(){\n\n}\n}`;
        fs.writeFileSync(filePath, fileContent);
        vscode.window.showInformationMessage(`${fileName}.ts created!`);
    });
    // Criar o comando de Enum
    const disposableEnum = vscode.commands.registerCommand('TS-BackEnd-Starter.createEnum', async (uri) => {
        const fileName = await vscode.window.showInputBox({ prompt: 'Enum name' });
        if (!fileName)
            return;
        const filePath = path.join(uri.fsPath, `${fileName}.ts`);
        const fileContent = `export enum ${fileName}{\n\n}`;
        fs.writeFileSync(filePath, fileContent);
        vscode.window.showInformationMessage(`${fileName}.ts created!`);
    });
    // Criar o comando de Routes
    const disposableRoutes = vscode.commands.registerCommand('TS-BackEnd-Starter.createRoute', async (uri) => {
        const fileName = await vscode.window.showInputBox({ prompt: 'Route name' });
        if (!fileName)
            return;
        const filePath = path.join(uri.fsPath, `${fileName}.routes.ts`);
        const fileContent = `import express, { Request, Response } from "express";\n\n\n\n\nconst router = express.Router(); \n\n // Definição das rotas\nrouter.get("/${fileName}",(req: Request, res: Response)=>\n{\nres.send("${fileName}");\n});\n\n\n\n\nexport default router;`;
        fs.writeFileSync(filePath, fileContent);
        vscode.window.showInformationMessage(`${fileName}.ts created!`);
    });
    context.subscriptions.push(disposableRoutes);
    context.subscriptions.push(disposableEnum);
    context.subscriptions.push(disposableClass);
    context.subscriptions.push(disposableInterface);
    context.subscriptions.push(disposableController);
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map