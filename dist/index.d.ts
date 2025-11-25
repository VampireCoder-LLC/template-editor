import { JSX } from 'react/jsx-runtime';
import { z } from 'zod';

declare type BaseZodDictionary = {
    [name: string]: z.ZodObject<any>;
};

declare type BlockConfiguration<T extends BaseZodDictionary> = {
    [TType in keyof T]: {
        type: TType;
        data: z.infer<T[TType]>;
    };
}[keyof T];

export declare const BUILD_NUMBER = "__BUILD_NUMBER__";

export declare const BUILD_TIME = "__BUILD_TIME__";

declare const EditorBlockSchema: z.ZodPipe<z.ZodDiscriminatedUnion<any, "type">, z.ZodTransform<BlockConfiguration<    {
Button: z.ZodObject<{
style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
fontSize: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
fontFamily: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
MODERN_SANS: "MODERN_SANS";
BOOK_SANS: "BOOK_SANS";
ORGANIC_SANS: "ORGANIC_SANS";
GEOMETRIC_SANS: "GEOMETRIC_SANS";
HEAVY_SANS: "HEAVY_SANS";
ROUNDED_SANS: "ROUNDED_SANS";
MODERN_SERIF: "MODERN_SERIF";
BOOK_SERIF: "BOOK_SERIF";
MONOSPACE: "MONOSPACE";
}>>>;
fontWeight: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
bold: "bold";
normal: "normal";
}>>>;
fontStyle: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
normal: "normal";
italic: "italic";
}>>>;
textAlign: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
right: "right";
left: "left";
center: "center";
justify: "justify";
}>>>;
textDecoration: z.ZodNullable<z.ZodOptional<z.ZodString>>;
padding: z.ZodNullable<z.ZodOptional<z.ZodObject<{
top: z.ZodNumber;
bottom: z.ZodNumber;
right: z.ZodNumber;
left: z.ZodNumber;
}, z.core.$strip>>>;
}, z.core.$strip>>>;
props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
buttonBackgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
buttonStyle: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
rectangle: "rectangle";
pill: "pill";
rounded: "rounded";
}>>>;
buttonTextColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
fullWidth: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
size: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
"x-small": "x-small";
small: "small";
large: "large";
medium: "medium";
}>>>;
text: z.ZodNullable<z.ZodOptional<z.ZodString>>;
url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
borderRadius: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>>>;
}, z.core.$strip>;
Container: z.ZodObject<{
style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
borderColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
borderRadius: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
padding: z.ZodNullable<z.ZodOptional<z.ZodObject<{
top: z.ZodNumber;
bottom: z.ZodNumber;
right: z.ZodNumber;
left: z.ZodNumber;
}, z.core.$strip>>>;
}, z.core.$strip>>>;
props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
childrenIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>>>;
}, z.core.$strip>;
ColumnsContainer: z.ZodObject<{
style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
padding: z.ZodNullable<z.ZodOptional<z.ZodObject<{
top: z.ZodNumber;
bottom: z.ZodNumber;
right: z.ZodNumber;
left: z.ZodNumber;
}, z.core.$strip>>>;
}, z.core.$strip>>>;
props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
columns: z.ZodTuple<[z.ZodObject<{
childrenIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
childrenIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
childrenIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>], null>;
fixedWidths: z.ZodNullable<z.ZodOptional<z.ZodTuple<[z.ZodOptional<z.ZodNullable<z.ZodNumber>>, z.ZodOptional<z.ZodNullable<z.ZodNumber>>, z.ZodOptional<z.ZodNullable<z.ZodNumber>>], null>>>;
columnsCount: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<2>, z.ZodLiteral<3>]>>>;
columnsGap: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
contentAlignment: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
top: "top";
bottom: "bottom";
middle: "middle";
}>>>;
}, z.core.$strip>>>;
}, z.core.$strip>;
Heading: z.ZodObject<{
props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
text: z.ZodNullable<z.ZodOptional<z.ZodString>>;
level: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
h1: "h1";
h2: "h2";
h3: "h3";
h4: "h4";
h5: "h5";
h6: "h6";
}>>>;
}, z.core.$strip>>>;
style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
color: z.ZodOptional<z.ZodNullable<z.ZodString>>;
backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
fontFamily: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
MODERN_SANS: "MODERN_SANS";
BOOK_SANS: "BOOK_SANS";
ORGANIC_SANS: "ORGANIC_SANS";
GEOMETRIC_SANS: "GEOMETRIC_SANS";
HEAVY_SANS: "HEAVY_SANS";
ROUNDED_SANS: "ROUNDED_SANS";
MODERN_SERIF: "MODERN_SERIF";
BOOK_SERIF: "BOOK_SERIF";
MONOSPACE: "MONOSPACE";
}>>>;
fontWeight: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
bold: "bold";
normal: "normal";
}>>>;
fontStyle: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
normal: "normal";
italic: "italic";
}>>>;
textAlign: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
right: "right";
left: "left";
center: "center";
justify: "justify";
}>>>;
textDecoration: z.ZodNullable<z.ZodOptional<z.ZodString>>;
padding: z.ZodNullable<z.ZodOptional<z.ZodObject<{
top: z.ZodNumber;
bottom: z.ZodNumber;
right: z.ZodNumber;
left: z.ZodNumber;
}, z.core.$strip>>>;
}, z.core.$strip>>>;
}, z.core.$strip>;
Html: z.ZodObject<{
style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
color: z.ZodOptional<z.ZodNullable<z.ZodString>>;
backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
fontFamily: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
MODERN_SANS: "MODERN_SANS";
BOOK_SANS: "BOOK_SANS";
ORGANIC_SANS: "ORGANIC_SANS";
GEOMETRIC_SANS: "GEOMETRIC_SANS";
HEAVY_SANS: "HEAVY_SANS";
ROUNDED_SANS: "ROUNDED_SANS";
MODERN_SERIF: "MODERN_SERIF";
BOOK_SERIF: "BOOK_SERIF";
MONOSPACE: "MONOSPACE";
}>>>;
fontSize: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
fontStyle: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
normal: "normal";
italic: "italic";
}>>>;
textAlign: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
right: "right";
left: "left";
center: "center";
justify: "justify";
}>>>;
textDecoration: z.ZodNullable<z.ZodOptional<z.ZodString>>;
padding: z.ZodNullable<z.ZodOptional<z.ZodObject<{
top: z.ZodNumber;
bottom: z.ZodNumber;
right: z.ZodNumber;
left: z.ZodNumber;
}, z.core.$strip>>>;
}, z.core.$strip>>>;
props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
contents: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>>>;
}, z.core.$strip>;
Image: z.ZodObject<{
style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
padding: z.ZodNullable<z.ZodOptional<z.ZodObject<{
top: z.ZodNumber;
bottom: z.ZodNumber;
right: z.ZodNumber;
left: z.ZodNumber;
}, z.core.$strip>>>;
backgroundColor: z.ZodNullable<z.ZodOptional<z.ZodString>>;
textAlign: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
right: "right";
left: "left";
center: "center";
justify: "justify";
}>>>;
}, z.core.$strip>>>;
props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
width: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
height: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
alt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
linkHref: z.ZodNullable<z.ZodOptional<z.ZodString>>;
contentAlignment: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
top: "top";
bottom: "bottom";
middle: "middle";
}>>>;
}, z.core.$strip>>>;
}, z.core.$strip>;
Text: z.ZodObject<{
style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
color: z.ZodOptional<z.ZodNullable<z.ZodString>>;
backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
fontSize: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
fontFamily: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
MODERN_SANS: "MODERN_SANS";
BOOK_SANS: "BOOK_SANS";
ORGANIC_SANS: "ORGANIC_SANS";
GEOMETRIC_SANS: "GEOMETRIC_SANS";
HEAVY_SANS: "HEAVY_SANS";
ROUNDED_SANS: "ROUNDED_SANS";
MODERN_SERIF: "MODERN_SERIF";
BOOK_SERIF: "BOOK_SERIF";
MONOSPACE: "MONOSPACE";
}>>>;
fontWeight: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
bold: "bold";
normal: "normal";
}>>>;
fontStyle: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
normal: "normal";
italic: "italic";
}>>>;
textAlign: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
right: "right";
left: "left";
center: "center";
justify: "justify";
}>>>;
textDecoration: z.ZodNullable<z.ZodOptional<z.ZodString>>;
padding: z.ZodNullable<z.ZodOptional<z.ZodObject<{
top: z.ZodNumber;
bottom: z.ZodNumber;
right: z.ZodNumber;
left: z.ZodNumber;
}, z.core.$strip>>>;
}, z.core.$strip>>>;
props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
markdown: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
text: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>>>;
}, z.core.$strip>;
EmailLayout: z.ZodObject<{
backdropColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
borderColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
borderRadius: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
canvasColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
textColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
fontFamily: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
MODERN_SANS: "MODERN_SANS";
BOOK_SANS: "BOOK_SANS";
ORGANIC_SANS: "ORGANIC_SANS";
GEOMETRIC_SANS: "GEOMETRIC_SANS";
HEAVY_SANS: "HEAVY_SANS";
ROUNDED_SANS: "ROUNDED_SANS";
MODERN_SERIF: "MODERN_SERIF";
BOOK_SERIF: "BOOK_SERIF";
MONOSPACE: "MONOSPACE";
}>>>;
contentWidth: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
600: "600";
640: "640";
700: "700";
}>>>;
shadowColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
shadowSize: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
shadowOpacity: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
childrenIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>;
Spacer: z.ZodObject<{
props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
height: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
}, z.core.$strip>>>;
}, z.core.$strip>;
Divider: z.ZodObject<{
style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
padding: z.ZodNullable<z.ZodOptional<z.ZodObject<{
top: z.ZodNumber;
bottom: z.ZodNumber;
right: z.ZodNumber;
left: z.ZodNumber;
}, z.core.$strip>>>;
}, z.core.$strip>>>;
props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
lineColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
lineHeight: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>>>;
}, z.core.$strip>;
}>, any>>;

export declare function Reader({ document, rootBlockId }: TReaderProps): JSX.Element;

declare const ReaderBlockSchema: z.ZodPipe<z.ZodDiscriminatedUnion<any, "type">, z.ZodTransform<BlockConfiguration<    {
ColumnsContainer: z.ZodObject<{
style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
padding: z.ZodNullable<z.ZodOptional<z.ZodObject<{
top: z.ZodNumber;
bottom: z.ZodNumber;
right: z.ZodNumber;
left: z.ZodNumber;
}, z.core.$strip>>>;
}, z.core.$strip>>>;
props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
columns: z.ZodTuple<[z.ZodObject<{
childrenIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
childrenIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
childrenIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>], null>;
fixedWidths: z.ZodNullable<z.ZodOptional<z.ZodTuple<[z.ZodOptional<z.ZodNullable<z.ZodNumber>>, z.ZodOptional<z.ZodNullable<z.ZodNumber>>, z.ZodOptional<z.ZodNullable<z.ZodNumber>>], null>>>;
columnsCount: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<2>, z.ZodLiteral<3>]>>>;
columnsGap: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
contentAlignment: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
top: "top";
bottom: "bottom";
middle: "middle";
}>>>;
}, z.core.$strip>>>;
}, z.core.$strip>;
Container: z.ZodObject<{
style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
borderColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
borderRadius: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
padding: z.ZodNullable<z.ZodOptional<z.ZodObject<{
top: z.ZodNumber;
bottom: z.ZodNumber;
right: z.ZodNumber;
left: z.ZodNumber;
}, z.core.$strip>>>;
}, z.core.$strip>>>;
props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
childrenIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>>>;
}, z.core.$strip>;
EmailLayout: z.ZodObject<{
backdropColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
borderColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
borderRadius: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
canvasColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
textColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
fontFamily: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
MODERN_SANS: "MODERN_SANS";
BOOK_SANS: "BOOK_SANS";
ORGANIC_SANS: "ORGANIC_SANS";
GEOMETRIC_SANS: "GEOMETRIC_SANS";
HEAVY_SANS: "HEAVY_SANS";
ROUNDED_SANS: "ROUNDED_SANS";
MODERN_SERIF: "MODERN_SERIF";
BOOK_SERIF: "BOOK_SERIF";
MONOSPACE: "MONOSPACE";
}>>>;
contentWidth: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
600: "600";
640: "640";
700: "700";
}>>>;
shadowColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
shadowSize: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
shadowOpacity: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
childrenIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>;
Button: z.ZodObject<{
style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
fontSize: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
fontFamily: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
MODERN_SANS: "MODERN_SANS";
BOOK_SANS: "BOOK_SANS";
ORGANIC_SANS: "ORGANIC_SANS";
GEOMETRIC_SANS: "GEOMETRIC_SANS";
HEAVY_SANS: "HEAVY_SANS";
ROUNDED_SANS: "ROUNDED_SANS";
MODERN_SERIF: "MODERN_SERIF";
BOOK_SERIF: "BOOK_SERIF";
MONOSPACE: "MONOSPACE";
}>>>;
fontWeight: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
bold: "bold";
normal: "normal";
}>>>;
fontStyle: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
normal: "normal";
italic: "italic";
}>>>;
textAlign: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
right: "right";
left: "left";
center: "center";
justify: "justify";
}>>>;
textDecoration: z.ZodNullable<z.ZodOptional<z.ZodString>>;
padding: z.ZodNullable<z.ZodOptional<z.ZodObject<{
top: z.ZodNumber;
bottom: z.ZodNumber;
right: z.ZodNumber;
left: z.ZodNumber;
}, z.core.$strip>>>;
}, z.core.$strip>>>;
props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
buttonBackgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
buttonStyle: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
rectangle: "rectangle";
pill: "pill";
rounded: "rounded";
}>>>;
buttonTextColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
fullWidth: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
size: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
"x-small": "x-small";
small: "small";
large: "large";
medium: "medium";
}>>>;
text: z.ZodNullable<z.ZodOptional<z.ZodString>>;
url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
borderRadius: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>>>;
}, z.core.$strip>;
Divider: z.ZodObject<{
style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
padding: z.ZodNullable<z.ZodOptional<z.ZodObject<{
top: z.ZodNumber;
bottom: z.ZodNumber;
right: z.ZodNumber;
left: z.ZodNumber;
}, z.core.$strip>>>;
}, z.core.$strip>>>;
props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
lineColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
lineHeight: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>>>;
}, z.core.$strip>;
Heading: z.ZodObject<{
props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
text: z.ZodNullable<z.ZodOptional<z.ZodString>>;
level: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
h1: "h1";
h2: "h2";
h3: "h3";
h4: "h4";
h5: "h5";
h6: "h6";
}>>>;
}, z.core.$strip>>>;
style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
color: z.ZodOptional<z.ZodNullable<z.ZodString>>;
backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
fontFamily: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
MODERN_SANS: "MODERN_SANS";
BOOK_SANS: "BOOK_SANS";
ORGANIC_SANS: "ORGANIC_SANS";
GEOMETRIC_SANS: "GEOMETRIC_SANS";
HEAVY_SANS: "HEAVY_SANS";
ROUNDED_SANS: "ROUNDED_SANS";
MODERN_SERIF: "MODERN_SERIF";
BOOK_SERIF: "BOOK_SERIF";
MONOSPACE: "MONOSPACE";
}>>>;
fontWeight: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
bold: "bold";
normal: "normal";
}>>>;
fontStyle: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
normal: "normal";
italic: "italic";
}>>>;
textAlign: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
right: "right";
left: "left";
center: "center";
justify: "justify";
}>>>;
textDecoration: z.ZodNullable<z.ZodOptional<z.ZodString>>;
padding: z.ZodNullable<z.ZodOptional<z.ZodObject<{
top: z.ZodNumber;
bottom: z.ZodNumber;
right: z.ZodNumber;
left: z.ZodNumber;
}, z.core.$strip>>>;
}, z.core.$strip>>>;
}, z.core.$strip>;
Html: z.ZodObject<{
style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
color: z.ZodOptional<z.ZodNullable<z.ZodString>>;
backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
fontFamily: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
MODERN_SANS: "MODERN_SANS";
BOOK_SANS: "BOOK_SANS";
ORGANIC_SANS: "ORGANIC_SANS";
GEOMETRIC_SANS: "GEOMETRIC_SANS";
HEAVY_SANS: "HEAVY_SANS";
ROUNDED_SANS: "ROUNDED_SANS";
MODERN_SERIF: "MODERN_SERIF";
BOOK_SERIF: "BOOK_SERIF";
MONOSPACE: "MONOSPACE";
}>>>;
fontSize: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
fontStyle: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
normal: "normal";
italic: "italic";
}>>>;
textAlign: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
right: "right";
left: "left";
center: "center";
justify: "justify";
}>>>;
textDecoration: z.ZodNullable<z.ZodOptional<z.ZodString>>;
padding: z.ZodNullable<z.ZodOptional<z.ZodObject<{
top: z.ZodNumber;
bottom: z.ZodNumber;
right: z.ZodNumber;
left: z.ZodNumber;
}, z.core.$strip>>>;
}, z.core.$strip>>>;
props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
contents: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>>>;
}, z.core.$strip>;
Image: z.ZodObject<{
style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
padding: z.ZodNullable<z.ZodOptional<z.ZodObject<{
top: z.ZodNumber;
bottom: z.ZodNumber;
right: z.ZodNumber;
left: z.ZodNumber;
}, z.core.$strip>>>;
backgroundColor: z.ZodNullable<z.ZodOptional<z.ZodString>>;
textAlign: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
right: "right";
left: "left";
center: "center";
justify: "justify";
}>>>;
}, z.core.$strip>>>;
props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
width: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
height: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
alt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
linkHref: z.ZodNullable<z.ZodOptional<z.ZodString>>;
contentAlignment: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
top: "top";
bottom: "bottom";
middle: "middle";
}>>>;
}, z.core.$strip>>>;
}, z.core.$strip>;
Spacer: z.ZodObject<{
props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
height: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
}, z.core.$strip>>>;
}, z.core.$strip>;
Text: z.ZodObject<{
style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
color: z.ZodOptional<z.ZodNullable<z.ZodString>>;
backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
fontSize: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
fontFamily: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
MODERN_SANS: "MODERN_SANS";
BOOK_SANS: "BOOK_SANS";
ORGANIC_SANS: "ORGANIC_SANS";
GEOMETRIC_SANS: "GEOMETRIC_SANS";
HEAVY_SANS: "HEAVY_SANS";
ROUNDED_SANS: "ROUNDED_SANS";
MODERN_SERIF: "MODERN_SERIF";
BOOK_SERIF: "BOOK_SERIF";
MONOSPACE: "MONOSPACE";
}>>>;
fontWeight: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
bold: "bold";
normal: "normal";
}>>>;
fontStyle: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
normal: "normal";
italic: "italic";
}>>>;
textAlign: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
right: "right";
left: "left";
center: "center";
justify: "justify";
}>>>;
textDecoration: z.ZodNullable<z.ZodOptional<z.ZodString>>;
padding: z.ZodNullable<z.ZodOptional<z.ZodObject<{
top: z.ZodNumber;
bottom: z.ZodNumber;
right: z.ZodNumber;
left: z.ZodNumber;
}, z.core.$strip>>>;
}, z.core.$strip>>>;
props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
markdown: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
text: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>>>;
}, z.core.$strip>;
}>, any>>;

export declare function renderToStaticMarkup(document: TReaderDocument, { rootBlockId }: TOptions): string;

export declare type TEditorBlock = z.infer<typeof EditorBlockSchema>;

export declare type TEditorConfiguration = Record<string, TEditorBlock> & {
    subject?: string;
};

/**
 * TemplateEditor Component
 *
 * A complete email template editor component that can be embedded in any React application.
 *
 * @example
 * ```typescript
 * import { TemplateEditor } from '@vampirecoder/template-editor';
 *
 * export default function MyApp() {
 *   return (
 *     <TemplateEditor
 *       initialJson={myTemplate}
 *       onSave={({ htmlOutput, jsonOutput, subjectOutput }) => {
 *         console.log('Saved!', { htmlOutput, jsonOutput, subjectOutput });
 *       }}
 *       showJsonTab={false}
 *     />
 *   );
 * }
 * ```
 */
export declare function TemplateEditor(props: TemplateEditorProps): JSX.Element;

/**
 * Props for the TemplateEditor component
 */
export declare interface TemplateEditorProps {
    /** Initial JSON template data to load */
    initialJson?: TEditorConfiguration;
    /** Initial HTML content (optional) */
    initialHtmlContent?: string;
    /** Callback fired when user saves the template */
    onSave?: (output: TemplateSaveOutput) => void;
    /** Show JSON tab in the editor (default: false) */
    showJsonTab?: boolean;
    /** Show save button (default: true) */
    showSaveButton?: boolean;
    /** Show download button (default: true) */
    showDownloadButton?: boolean;
    /** Show import button (default: true) */
    showImportButton?: boolean;
    /** Show settings button (default: true) */
    showSettingsButton?: boolean;
    /** Container height (default: 100vh) */
    height?: string;
    /** Template fields available for insertion as Handlebars syntax (default: []) */
    templateFields?: (string | TemplateField)[];
}

/**
 * Template field for Handlebars insertion
 */
export declare interface TemplateField {
    /** Field name/identifier */
    name: string;
    /** Optional display label for the field */
    label?: string;
    /** Optional description of what the field represents */
    description?: string;
}

/**
 * Output object passed to onSave callback
 */
export declare interface TemplateSaveOutput {
    /** Rendered HTML output of the template */
    htmlOutput: string;
    /** JSON representation of the template */
    jsonOutput: Record<string, any>;
    /** Email subject line */
    subjectOutput: string;
}

declare type TOptions = {
    rootBlockId: string;
};

export declare type TReaderBlock = z.infer<typeof ReaderBlockSchema>;

export declare type TReaderDocument = Record<string, TReaderBlock>;

declare type TReaderProps = {
    document: Record<string, z.infer<typeof ReaderBlockSchema>>;
    rootBlockId: string;
};

/**
 * Version information for the template editor library.
 * This file is auto-generated during the build process.
 */
export declare const VERSION = "__VERSION__";

export { }
