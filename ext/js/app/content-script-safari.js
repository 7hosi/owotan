/*
 * Copyright (C) 2026  Yomitan Authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// The content script in Safari, in place of content-script-wrapper.js. Safari's content blockers treat the extension's
// modules that a content script imports as scripts of another site, so a rule that blocks those scripts in a page, as
// ad blockers have for some sites, kept the content script from running there. The build bundles this script and the
// modules it imports into one script (dev/bin/build.js), which Safari runs as a content script without loading anything.

(async () => {
    // Safari runs the content scripts again in the pages that are open when the extension loads, as when it reloads,
    // and the copies that were already running keep working. Each would show its own popup, one over the other. So a
    // copy whose extension still works cancels this event, and a copy that finds it canceled does nothing.
    const contentScriptCheckEvent = 'yomitan-content-script-check';
    if (!document.dispatchEvent(new Event(contentScriptCheckEvent, {cancelable: true}))) { return; }
    document.addEventListener(contentScriptCheckEvent, (event) => {
        try {
            if (typeof chrome.runtime.id !== 'string') { return; }
        } catch (e) {
            return;
        }
        event.preventDefault();
    });

    await import('./content-script-main.js');
})();
