export type BaseEntity = {
    id: string;
    title: string;
};

export type Category = BaseEntity & {
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

export type CategoryActionState = {
    errors?: {
        id?: string[] | undefined;
        title?: string[] | undefined;
        color?: string[] | undefined;
    };
    message?: string | null;
};

export type CategoryType = "TYPE" | "TAG";
