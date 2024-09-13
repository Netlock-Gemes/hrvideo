export function parseWebVTT(vttText) {
    const cues = [];
    const lines = vttText.split('\n').filter(line => line.trim() !== '');

    let cue = null;
    
    for (const line of lines) {
        if (/^\d{2}:\d{2}:\d{2}/.test(line)) {
            if (cue) {
                cues.push(cue);
            }
            const [times, ...textLines] = line.split('\n');
            const [start, end] = times.split(' --> ');
            cue = {
                start: start.trim(),
                end: end.trim(),
                text: textLines.join('\n').trim()
            };
        } else if (cue) {
            cue.text += '\n' + line.trim();
        }
    }
    
    if (cue) {
        cues.push(cue);
    }

    return cues.map(cue => ({
        ...cue,
        text: cleanSubtitleText(cue.text)
    }));
}

function cleanSubtitleText(text) {
    // eslint-disable-next-line no-useless-escape
    return text.replace(/^\d+[\s\-]*/gm, '')
    // eslint-disable-next-line no-useless-escape
                .replace(/[\s\-]*\d+$/gm, '')
                .trim();
}
