/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { memo, SetStateAction, useCallback, useEffect, useState } from "react";
import { InView } from "react-intersection-observer";
import { List } from "react-virtualized";
import { FixedSizeList } from "react-window";

interface CheckboxItem {
    id: number;
    label: string;
    checked: boolean;
}

const generateItems = (length: number): CheckboxItem[] => {
    return Array.from({ length }, (_, i) => ({
        id: i + 1,
        label: `Item ${i + 1}`,
        checked: false,
    }));
};

const CheckboxRowList = memo(({ items }: { items: CheckboxItem[] }) => {
    const renderRow = useCallback(
        (item: CheckboxItem) => (
            <div key={item.id}>
                <label>
                    <input type="checkbox" />
                    {item.label}
                </label>
            </div>
        ),
        []
    );

    return <div style={{ marginBottom: "5px" }}>{items.map(renderRow)}</div>;
});
CheckboxRowList.displayName = "CheckboxRowList";

const NormalRenderingList = ({
    items,
    setItems,
}: {
    items: CheckboxItem[];
    setItems: React.Dispatch<SetStateAction<CheckboxItem[]>>;
}) => {
    const toggleCheckbox = (index: number) => {
        const updatedItems = [...items];
        updatedItems[index].checked = !updatedItems[index].checked;
        setItems(updatedItems);
    };

    return (
        <div
            style={{
                height: "500px",
                overflowY: "auto",
                padding: "10px",
            }}
        >
            {items.map((item, index) => (
                <div key={item.id} style={{ marginBottom: "5px" }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleCheckbox(index)}
                        />
                        {item.label}
                    </label>
                </div>
            ))}
        </div>
    );
};

const MemoizedRenderingList = ({ items }: { items: CheckboxItem[] }) => {
    return (
        <div
            style={{
                height: "500px",
                overflowY: "auto",
                padding: "10px",
            }}
        >
            <CheckboxRowList items={items} />
        </div>
    );
};

const ReactIntersectionObserverList = ({
    items,
    setItems,
}: {
    items: CheckboxItem[];
    setItems: React.Dispatch<SetStateAction<CheckboxItem[]>>;
}) => {
    const toggleCheckbox = (index: number) => {
        const updatedItems = [...items];
        updatedItems[index].checked = !updatedItems[index].checked;
        setItems(updatedItems);
    };

    return (
        <div
            style={{
                height: "500px",
                overflowY: "auto",
                padding: "10px",
            }}
        >
            {items.map((item, index) => (
                <InView key={item.id}>
                    {({ inView, ref }) => (
                        <div
                            ref={ref}
                            style={{ marginBottom: "5px", height: "25px" }}
                        >
                            {inView ? (
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={item.checked}
                                        onChange={() => toggleCheckbox(index)}
                                    />
                                    {item.label}
                                </label>
                            ) : null}
                        </div>
                    )}
                </InView>
            ))}
        </div>
    );
};

const ReactVirtualizedList = ({
    items,
    setItems,
}: {
    items: CheckboxItem[];
    setItems: React.Dispatch<SetStateAction<CheckboxItem[]>>;
}) => {
    const toggleCheckbox = (index: number) => {
        const updatedItems = [...items];
        updatedItems[index].checked = !updatedItems[index].checked;
        setItems(updatedItems);
    };

    const rowRenderer = ({ key, index, style }: any) => (
        <div key={key} style={style}>
            <label>
                <input
                    type="checkbox"
                    checked={items[index].checked}
                    onChange={() => toggleCheckbox(index)}
                />
                {items[index].label}
            </label>
        </div>
    );

    return (
        <List
            width={240}
            height={520}
            rowCount={items.length}
            rowHeight={25}
            rowRenderer={rowRenderer}
        />
    );
};

const ReactWindowList = ({
    items,
    setItems,
}: {
    items: CheckboxItem[];
    setItems: React.Dispatch<SetStateAction<CheckboxItem[]>>;
}) => {
    const toggleCheckbox = (index: number) => {
        const updatedItems = [...items];
        updatedItems[index].checked = !updatedItems[index].checked;
        setItems(updatedItems);
    };

    const renderRow = ({
        index,
        style,
    }: {
        index: number;
        style: React.CSSProperties;
    }) => (
        <div style={style}>
            <label>
                <input
                    type="checkbox"
                    checked={items[index].checked}
                    onChange={() => toggleCheckbox(index)}
                />
                {items[index].label}
            </label>
        </div>
    );

    return (
        <FixedSizeList
            height={500}
            itemCount={items.length}
            itemSize={25}
            width={220}
            style={{ padding: "10px" }}
        >
            {renderRow}
        </FixedSizeList>
    );
};

const CheckboxContainer = (
    props: React.PropsWithChildren<{ title: string }>
): JSX.Element => {
    const [isVisible, setIsVisible] = useState(false);
    const [timers, setTimers] = useState<string[]>([]);

    useEffect(() => {
        if (!isVisible) {
            setTimers([]);
            return;
        }

        const startTime = performance.now();

        requestAnimationFrame(() => {
            const endTime = performance.now();
            console.log(
                `Paint completed in ${(endTime - startTime).toFixed(2)} ms`
            );
            setTimers((p) => [...p, (endTime - startTime).toFixed(2) + " ms"]);
        });
    }, [isVisible]);

    return (
        <div style={{ width: "250px" }}>
            <button
                style={{ border: "1px solid #000", padding: "4px 6px" }}
                onClick={() => setIsVisible((p) => !p)}
            >
                {props.title}
            </button>
            {isVisible && (
                <div style={{ border: "1px solid #000", padding: "5px" }}>
                    {props.children}
                </div>
            )}
            <div>
                {timers.map((p) => (
                    <span key={p}>{p}</span>
                ))}
            </div>
        </div>
    );
};

const defaultValue = 10000;

export default function Home() {
    const [items, setItems] = useState<CheckboxItem[]>(() =>
        generateItems(defaultValue)
    );
    const [itemLength, setItemLength] = useState<number>(defaultValue);

    return (
        <>
            <div style={{ marginBottom: "10px" }}>
                <input
                    type="number"
                    value={itemLength}
                    min={1}
                    onChange={(e) => setItemLength(Number(e.target.value))}
                />
                <button
                    style={{ border: "1px solid #000", padding: "5px" }}
                    onClick={() => {
                        if (itemLength !== items.length) {
                            setItems(generateItems(itemLength));
                        }
                    }}
                >
                    Update
                </button>
            </div>
            <div style={{ display: "flex", columnGap: "5px" }}>
                <CheckboxContainer title="Normal Rendering">
                    <NormalRenderingList
                        items={items}
                        setItems={setItems}
                        key={items.length}
                    />
                </CheckboxContainer>
                <CheckboxContainer title="Memoized Rendering">
                    <MemoizedRenderingList items={items} key={items.length} />
                </CheckboxContainer>
                <CheckboxContainer title="react-intersection-observer">
                    <ReactIntersectionObserverList
                        items={items}
                        setItems={setItems}
                        key={items.length}
                    />
                </CheckboxContainer>
                <CheckboxContainer title="react-virtualized">
                    <ReactVirtualizedList items={items} setItems={setItems} />
                </CheckboxContainer>
                <CheckboxContainer title="react-window">
                    <ReactWindowList
                        items={items}
                        setItems={setItems}
                        key={items.length}
                    />
                </CheckboxContainer>
            </div>
        </>
    );
}
