import clsx from 'clsx';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import isHotkey from 'is-hotkey';
import {
    createContext,
    Dispatch,
    KeyboardEvent,
    ReactNode,
    useContext,
    useReducer,
    useCallback,
} from 'react';
import {
    getFirstFocusableId,
    getLastFocusableId,
    getNextFocusableId,
    getNextFocusableIdByTypeahead,
    getParentFocusableId,
    getPrevFocusableId,
    RovingTabindexItem,
    RovingTabindexRoot,
    useRovingTabindex,
} from './roving-tabindex';
import './FileTree.css'; // Ensure this line is present to import styles

export type TreeViewState = Map<string, { isOpen: boolean; children: TreeNodeType[] }>;

export enum TreeViewActionTypes {
    OPEN = 'OPEN',
    CLOSE = 'CLOSE',
    SET_CHILDREN = 'SET_CHILDREN',
}

export type TreeViewActions =
    | {
          type: TreeViewActionTypes.OPEN;
          id: string;
      }
    | {
          type: TreeViewActionTypes.CLOSE;
          id: string;
      }
    | {
          type: TreeViewActionTypes.SET_CHILDREN;
          id: string;
          children: TreeNodeType[];
      };

export function treeviewReducer(
    state: TreeViewState,
    action: TreeViewActions,
): TreeViewState {
    const newState = new Map(state);
    switch (action.type) {
        case TreeViewActionTypes.OPEN:
            newState.set(action.id, { ...newState.get(action.id), isOpen: true, children: newState.get(action.id)?.children || [] });
            return newState;

        case TreeViewActionTypes.CLOSE:
            newState.set(action.id, { ...newState.get(action.id), isOpen: false, children: newState.get(action.id)?.children || [] });
            return newState;

        case TreeViewActionTypes.SET_CHILDREN:
            newState.set(action.id, { isOpen: true, children: action.children });
            return newState;

        default:
            throw new Error('Tree Reducer received an unknown action');
    }
}

export type TreeViewContextType = {
    open: TreeViewState;
    dispatch: Dispatch<TreeViewActions>;
    selectedId: string | null;
    selectId: (id: string) => void;
    fetchChildren: (id: string) => Promise<TreeNodeType[]>;
};

export const TreeViewContext = createContext<TreeViewContextType>({
    open: new Map<string, { isOpen: boolean, children: TreeNodeType[] }>(),
    dispatch: () => {},
    selectedId: null,
    selectId: () => {},
    fetchChildren: async () => [],
});

type RootProps = {
    children: ReactNode | ReactNode[];
    className?: string;
    value: string | null;
    onChange: (id: string) => void;
    label: string;
    fetchChildren: (id: string) => Promise<TreeNodeType[]>;
};

export function Root({
    children,
    className,
    value,
    onChange,
    label,
    fetchChildren,
}: RootProps) {
    const [open, dispatch] = useReducer(
        treeviewReducer,
        new Map<string, { isOpen: boolean, children: TreeNodeType[] }>(),
    );

    return (
        <TreeViewContext.Provider
            value={{
                open,
                dispatch,
                selectedId: value,
                selectId: onChange,
                fetchChildren,
            }}
        >
            <RovingTabindexRoot
                as="ul"
                className={clsx('tree-view flex flex-col overflow-auto', className)}
                aria-label={label}
                aria-multiselectable="false"
                role="tree"
            >
                {children}
            </RovingTabindexRoot>
        </TreeViewContext.Provider>
    );
}

export type TreeNodeType = {
    id: string;
    name: string;
    children?: TreeNodeType[];
    icon?: ReactNode;
    directory?: boolean;
};

type IconProps = { open?: boolean; className?: string };

export function Arrow({ open, className }: IconProps) {
    return (
        <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={clsx('origin-center', className)}
            animate={{ rotate: open ? 90 : 0 }}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
        </motion.svg>
    );
}

type NodeProps = {
    node: TreeNodeType;
};

export const Node = function TreeNode({
    node: { id, children, name, directory },
}: NodeProps) {
    const { open, dispatch, selectId, selectedId, fetchChildren } = useContext(TreeViewContext);
    const { isFocusable, getRovingProps, getOrderedItems } =
        useRovingTabindex(id);
    const nodeState = open.get(id) || { isOpen: false, children: [] };
    const isOpen = nodeState.isOpen;
    const hasChildren = nodeState.children.length > 0 || (children && children.length > 0);

    const handleToggle = useCallback(async () => {
        if (isOpen) {
            dispatch({ type: TreeViewActionTypes.CLOSE, id });
        } else {
            dispatch({ type: TreeViewActionTypes.OPEN, id });
            if (nodeState.children.length === 0) {
                const fetchedChildren = await fetchChildren(id);
                dispatch({
                    type: TreeViewActionTypes.SET_CHILDREN,
                    id,
                    children: fetchedChildren,
                });
            }
        }
    }, [id, isOpen, nodeState.children, fetchChildren]);

    return (
        <li
            {...getRovingProps<'li'>({
                className:
                    'node flex flex-col cursor-pointer select-none focus:outline-none group',
                onKeyDown: function (e: KeyboardEvent) {
                    e.stopPropagation();

                    const items = getOrderedItems();
                    let nextItemToFocus: RovingTabindexItem | undefined;

                    if (isHotkey('up', e)) {
                        e.preventDefault();
                        nextItemToFocus = getPrevFocusableId(items, id);
                    } else if (isHotkey('down', e)) {
                        e.preventDefault();
                        nextItemToFocus = getNextFocusableId(items, id);
                    } else if (isHotkey('left', e)) {
                        if (isOpen && hasChildren) {
                            dispatch({
                                type: TreeViewActionTypes.CLOSE,
                                id,
                            });
                        } else {
                            nextItemToFocus = getParentFocusableId(items, id);
                        }
                    } else if (isHotkey('right', e)) {
                        if (isOpen && hasChildren) {
                            nextItemToFocus = getNextFocusableId(items, id);
                        } else {
                            dispatch({ type: TreeViewActionTypes.OPEN, id });
                        }
                    } else if (isHotkey('home', e)) {
                        e.preventDefault();
                        nextItemToFocus = getFirstFocusableId(items);
                    } else if (isHotkey('end', e)) {
                        e.preventDefault();
                        nextItemToFocus = getLastFocusableId(items);
                    } else if (/^[a-z]$/i.test(e.key)) {
                        nextItemToFocus = getNextFocusableIdByTypeahead(
                            items,
                            id,
                            e.key,
                        );
                    } else if (isHotkey('space', e)) {
                        e.preventDefault();
                        selectId(id);
                    }
                    nextItemToFocus?.element.focus();
                },
                ['aria-expanded']: hasChildren ? Boolean(isOpen) : undefined,
                ['aria-selected']: selectedId === id,
                role: 'treeitem',
            })}
        >
            <MotionConfig
                transition={{
                    ease: [0.164, 0.84, 0.43, 1],
                    duration: 0.25,
                }}
            >
                <div
                    className={clsx(
                        'node-label flex items-center space-x-2 font-mono font-medium px-1 border-[1.5px] border-transparent',
                        isFocusable && 'group-focus:border-slate-500',
                        selectedId === id ? 'bg-slate-200' : 'bg-transparent',
                    )}
                    onClick={() => {
                        handleToggle();
                        selectId(id);
                    }}
                >
                    {hasChildren ? (
                        <Arrow className="icon h-4 w-4 shrink-0" open={isOpen} />
                    ) : (
                        <span className="icon h-4 w-4" />
                    )}
                    {directory ? (
                        <i className={clsx('fa', isOpen ? 'fa-folder-open' : 'fa-folder', 'folder')} />
                    ) : (
                        <i className="fa fa-file file" />
                    )}
                    <span className="text-ellipsis whitespace-nowrap overflow-hidden">
                        {name}
                    </span>
                </div>
                <AnimatePresence initial={false}>
                    {isOpen && nodeState.children.length > 0 && (
                        <motion.ul
                            initial={{
                                height: 0,
                                opacity: 0,
                            }}
                            animate={{
                                height: 'auto',
                                opacity: 1,
                                transition: {
                                    height: {
                                        duration: 0.25,
                                    },
                                    opacity: {
                                        duration: 0.2,
                                        delay: 0.05,
                                    },
                                },
                            }}
                            exit={{
                                height: 0,
                                opacity: 0,
                                transition: {
                                    height: {
                                        duration: 0.25,
                                    },
                                    opacity: {
                                        duration: 0.2,
                                    },
                                },
                            }}
                            key={'ul'}
                            role="group"
                            className="children pl-4 relative"
                        >
                            {nodeState.children.map(node => (
                                <Node node={node} key={node.id} />
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </MotionConfig>
        </li>
    );
};

export const Treeview = { Root, Node };
