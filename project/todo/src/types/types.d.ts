export type BaseEntity = {
    id: string;
    title: string;
};

export type Type = BaseEntity & {
    color: string;
};

export type Tag = BaseEntity & {
    color: string;
};

export type Todo = BaseEntity & {
    description: string;
    dueDate: string;
    type?: string;
    tags?: string[];
};

export type TaskActionState = {
    errors?: {
        id?: string[] | undefined;
        title?: string[] | undefined;
        type?: string[] | undefined;
        description?: string[] | undefined;
        dueDate?: string[] | undefined;
        tags?: string[] | undefined;
    };
    message?: string | null;
};

export type ListActionState = {
    errors?: {
        id?: string[] | undefined;
        title?: string[] | undefined;
        color?: string[] | undefined;
    };
    message?: string | null;
};

export type TagActionState = {
    errors?: {
        id?: string[] | undefined;
        title?: string[] | undefined;
        background?: string[] | undefined;
    };
    message?: string | null;
};
