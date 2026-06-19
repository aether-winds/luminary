import { Maybe } from '../../../utils';

export type AttributeChangedCallback =
    (name: string, oldValue: Maybe<string>, newValue: Maybe<string>) => void;

export interface WithObservedAttributes {
    onAttributeChange: AttributeChangedCallback;
}
