const vscode = require('vscode');
const { THEME_LABEL, CURSOR_COLOR, LINE_HIGHLIGHT } = require('./branding');

function isVerdeActive() {
    const themeId = vscode.workspace.getConfiguration().get('workbench.colorTheme');
    return themeId === THEME_LABEL;
}

function activate(context) {
    const onConfig = vscode.workspace.onDidChangeConfiguration((event) => {
        if (
            event.affectsConfiguration('fectionlabsVerde') ||
            event.affectsConfiguration('workbench.colorTheme')
        ) {
            applyOptionalOverrides();
        }
    });

    context.subscriptions.push(onConfig);
    applyOptionalOverrides();
}

function applyOptionalOverrides() {
    const config = vscode.workspace.getConfiguration('fectionlabsVerde');
    const workbench = vscode.workspace.getConfiguration();

    if (!isVerdeActive()) {
        workbench.update(
            'workbench.colorCustomizations',
            {},
            vscode.ConfigurationTarget.Global
        );
        return;
    }

    const overrides = {};

    if (config.get('enableCustomCursor')) {
        overrides['editorCursor.foreground'] = CURSOR_COLOR;
    }
    if (config.get('enableLineHighlight')) {
        overrides['editor.lineHighlightBackground'] = LINE_HIGHLIGHT;
    }

    workbench.update(
        'workbench.colorCustomizations',
        overrides,
        vscode.ConfigurationTarget.Global
    );
}

function deactivate() {
    vscode.workspace
        .getConfiguration()
        .update(
            'workbench.colorCustomizations',
            {},
            vscode.ConfigurationTarget.Global
        );
}

module.exports = { activate, deactivate };
