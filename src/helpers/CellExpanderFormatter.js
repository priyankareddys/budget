import { useRef } from 'react';

export function CellExpanderFormatter({ isCellSelected, expanded, onCellExpand }) {
    const iconRef = useRef(null);

    function handleClick(e) {
        e.stopPropagation();
        onCellExpand();
    }

    function handleKeyDown(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onCellExpand();
        }
    }

    return (
        <div style={{float:'right', display:'table', height:'100%'}}>
            <span class="row-pad"
                style={{display:'table-cell', verticalAlign:'middle', cursor:'pointer'}}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
            >
                <span
                    ref={iconRef}
                    tabIndex={-1}
                >
                    {expanded ? '\u25BC' : '\u25B6'}
                </span>
            </span>
        </div>
    );
}