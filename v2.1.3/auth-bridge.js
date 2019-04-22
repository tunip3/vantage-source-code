const ipcRenderer = require('electron').ipcRenderer;

const interval = setInterval(() => {
    if (!window.CloudExperienceHost || !window.CloudExperienceHost.Bridge) {
        return;
    }

    const realInvoke = CloudExperienceHost.Bridge.prototype.invoke;
    CloudExperienceHost.Bridge.prototype.invoke = function(func) {
        ipcRenderer.sendToHost('invoke', ...Array.prototype.slice.call(arguments));
        return realInvoke.apply(this, arguments);
    };

    clearInterval(interval);
}, 50);