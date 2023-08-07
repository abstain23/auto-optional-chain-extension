
import type { NodePath, types } from '@babel/core';
import * as babel from '@babel/core';
import * as vscode from 'vscode';

function transform(code: string): string {
	function autoOptionalPlugin() {
		return {
			visitor: {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				MemberExpression(path: NodePath<types.MemberExpression>) {
					const text = path.toString();
	
					path.replaceWithSourceString(text.replace(/\./g, '?.'));
				}
			}
		};
	}
	const res = babel.transformSync(code, {
		plugins: [autoOptionalPlugin]
	});

	return res?.code || '';
}

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('transformToOptionalChain', () => {
		const editor = vscode.window.activeTextEditor;

		if(editor) {
			const selectedText = editor.document.getText(editor.selection);
			editor.edit(builder => {
				builder.replace(editor.selection, transform(selectedText));
			});
			vscode.window.showInformationMessage('转换成功');
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
