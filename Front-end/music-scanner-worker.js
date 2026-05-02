// Web Worker for scanning music files in background thread
const audioFormats = ['.mp3', '.wav', '.m4a', '.ogg', '.aac', '.flac'];
const maxFolderDepth = 2;
const maxFiles = 300;
let foundFiles = [];

self.onmessage = async (event) => {
    const { dirHandle, command } = event.data;

    if (command === 'scan') {
        foundFiles = [];
        try {
            await traverse(dirHandle, 0);
            self.postMessage({ 
                type: 'complete', 
                files: foundFiles 
            });
        } catch (error) {
            self.postMessage({ 
                type: 'error', 
                message: error.message 
            });
        }
    } else if (command === 'cancel') {
        foundFiles = [];
        self.postMessage({ type: 'cancelled' });
    }
};

async function traverse(dir, depth = 0) {
    if (foundFiles.length >= maxFiles || depth > maxFolderDepth) {
        return;
    }

    try {
        let count = 0;
        for await (const [name, handle] of dir.entries()) {
            // Stop if max reached
            if (foundFiles.length >= maxFiles) {
                self.postMessage({ 
                    type: 'progress', 
                    count: foundFiles.length,
                    status: `Limit reached (${foundFiles.length}/${maxFiles})`
                });
                return;
            }

            try {
                if (handle.kind === 'file') {
                    const ext = '.' + name.split('.').pop().toLowerCase();
                    if (audioFormats.includes(ext)) {
                        try {
                            const file = await handle.getFile();
                            const nameParts = name.replace(ext, '').split(' - ');
                            foundFiles.push({
                                name: name.replace(ext, ''),
                                file: file,
                                artist: nameParts.length > 1 ? nameParts[0] : 'Unknown',
                                size: file.size
                            });

                            count++;
                            if (count % 15 === 0) {
                                self.postMessage({ 
                                    type: 'progress', 
                                    count: foundFiles.length,
                                    status: `Found ${foundFiles.length} songs...`
                                });
                                // Yield to browser through worker
                                await new Promise(r => setTimeout(r, 1));
                            }
                        } catch (e) {
                            // Skip file on error
                        }
                    }
                } else if (handle.kind === 'directory' && depth < maxFolderDepth) {
                    try {
                        await traverse(handle, depth + 1);
                    } catch (e) {
                        // Skip directory on error
                    }
                }
            } catch (e) {
                // Skip entry on error
            }
        }
    } catch (e) {
        self.postMessage({ 
            type: 'error', 
            message: `Traverse error: ${e.message}` 
        });
    }
}
