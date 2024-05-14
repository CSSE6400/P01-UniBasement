import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';

export function Upvote({ count, selected, onClick }: { count: number, selected: boolean, onClick: () => void }) {
    return (
        <div className="flex">
            <button onClick={onClick}>
                <IconArrowUp color={selected ? 'orange' : 'white'}/>
            </button>
            <p>{count}</p>
        </div>
    );
}

export function Downvote({ count, selected, onClick }: { count: number, selected: boolean, onClick: () => void }) {
    return (
        <div className="flex">
            <button onClick={onClick}>
                <IconArrowDown color={selected ? 'red' : 'white'}/>
            </button>
            <p>{count}</p>
        </div>
    );
}