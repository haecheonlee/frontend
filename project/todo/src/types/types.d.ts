export type BaseEntity = {
    id: string;
    title: string;
};

export type Type = BaseEntity & {
    color: string;
};

export type Tag = BaseEntity & {
    background: string;
};

export type Todo = BaseEntity & {
    description: string;
    type?: Type;
    tags?: Tag[];
};
