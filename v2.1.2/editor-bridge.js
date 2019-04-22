const ipcRenderer = require('electron').ipcRenderer;

// Keep a reference to Buffer before Electron deletes it.
const Buffer = window.Buffer;

let editor;

window.vantage = {
    Buffer: Buffer,
    setEditor(e) {
        editor = e;
        ipcRenderer.sendToHost('editor', 'initialized');
    },
    openDevTools() {
        ipcRenderer.sendToHost('editor', 'dev-tools');
    },
};

ipcRenderer.addListener('editor', function(_, type, data) {
    if (type === 'load') {
        console.info('Loading save data...');
        if (editor) {
            try {
                Promise.resolve(editor.load(Buffer.from(data.buffer)))
                    .then(() => ipcRenderer.sendToHost('editor', 'loaded'))
                    .catch(e => ipcRenderer.sendToHost('editor', 'loaded', e));
            } catch (e) {
                ipcRenderer.sendToHost('editor', 'loaded', e);
            }
        }
    } else if (type === 'save') {
        console.info('Saving...');
        if (editor) {
            try {
                Promise.resolve(editor.save())
                    .then(data => ipcRenderer.sendToHost('editor', 'saved', undefined, data))
                    .catch(e => ipcRenderer.sendToHost('editor', 'saved', e));
            } catch (e) {
                ipcRenderer.sendToHost('editor', 'saved', e);
            }
        }
    }
});
