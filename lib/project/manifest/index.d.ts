import { Value, Object } from '@quenk/noni/lib/data/jsonx';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Path } from '@quenk/noni/lib/io/file';
/**
 * BaseType specifier.
 */
export interface BaseType extends Object {
    /**
     * type indicating the correct type for the value.
     */
    type: string;
    /**
     * optional indicates whether the property is optional.
     */
    optional?: boolean;
    /**
     * prompt is a string that will be used if we need to prompt for the value.
     */
    prompt?: string;
    /**
     * default value that will be used if not specified.
     */
    default?: Value;
}
/**
 * PrimitiveType specifier.
 */
export interface PrimitiveType extends BaseType {
}
/**
 * EnumType specifier.
 */
export interface EnumType extends BaseType {
    /**
     * values that are valid for the enum.
     */
    values: (number | boolean | string)[];
}
/**
 * Manifest is the type of the data from the eric.json file that should be in
 * each project template.
 */
export interface Manifest extends Object {
    /**
     * name of the project template.
     */
    name: string;
    /**
     * context is a record of property paths to type specifiers expected of the
     * context used to expand the project.
     */
    context: Record<string, PrimitiveType | EnumType>;
}
/**
 * validateManifest found in the directory specified.
 */
export declare const validateManifest: (dest: Path) => Future<Manifest>;
