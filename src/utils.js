import React from 'react'
import {Typography} from "@material-ui/core";

const typographyTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'lic']
let mentions = {}  // single source of reference for mentions - if one is changed here, it's changed everywhere else too

/**
 * Processes the input text by replacing line breaks and applying optional formatting, then returns the processed text as HTML.
 *
 * @param {string} text - the input text to be processed
 * @param {boolean} [bold=false] - whether to apply bold formatting
 * @param {boolean} [underline=false] - whether to apply underline formatting
 * @param {boolean} [italic=false] - whether to apply italic formatting
 * @return {ReactNode} a React element representing the processed text as HTML
 */
function processText(text, bold = false, underline = false, italic = false) {

    text = text.replaceAll('\n', '<br>');
    if (bold) {
        text = `<b>${text}</b>`
    }
    if (underline) {
        text = `<u>${text}</u>`
    }
    if (italic) {
        text = `<em>${text}</em>`
    }
    return <span dangerouslySetInnerHTML={{__html: text}}/>
}

/**
 * Parses the input JSON node and its children recursively, applying styles and formatting.
 *
 * @param {Object} node - the input node to be parsed
 * @param {number} index - the index of the node within its parent
 * @param {Object} params - the parameters for styling and formatting
 * @param {Object} classes - the CSS classes from the makeStyles hook
 * @param {number} clauseNumber - the current clause number for ordered lists
 * @return {Object} the parsed JSX element
 */
export function parseInput(node, index, params, classes, clauseNumber) {
    // single-interface function to call parseInput
    function recurse(children, params, classes) {
        let clause = 0;
        return children.map((child, i) => {
            if (child.type === 'clause') clause++;
            return parseInput(child, i, {...params}, classes, clause)  // pass a copy of params because the element is mutable
        })
    }

    if (!node) return (<></>);  // empty node

    if (!params) {
        params = {
            bold: false,
            underline: false,
            isInP: false  // to avoid nesting <p>s
        }
    }

    let {
        type = '',
        children = undefined,
        text = '',
        bold = params.bold,
        underline = params.underline,
        italic = params.italic,
        color = 'black', // only for mention
        id = undefined // only for mention
    } = node;

    // propagate bold/underline/italic to children
    params.bold = bold;
    params.underline = underline;
    params.italic = italic;

    // avoid nesting <p>s
    if (type === 'p' && params.isInP === true) {
        type = '';
    }

    // process children (block/mention/clause/ul/li/text)
    if (type === 'block') {
        return (
            <div key={index}>
                {children && recurse(children, params, classes)}
            </div>
        )
    } else if (typographyTags.includes(type)) {
        if (type === 'p' || type === 'lic') {
            type = 'body1'
            params.isInP = true
        }
        return (
            <Typography
                key={index}
                variant={type}
                style={{color}}
                component={'p'}
            >
                {children && recurse(children, params, classes)}
                {processText(text, bold, underline)}
            </Typography>
        )
    } else if (type === 'mention') {
        // if mention is not yet initialized,
        if (!mentions?.[id]) {
            mentions[id] = {
                children: children,
                color: color
            }
        }
        return <span key={index} className={classes.mention} style={{backgroundColor: color}}>
            {mentions[id].children && mentions[id].children.map((child, i) => parseInput(child, i, params, classes))}
        </span>
    } else if (type === 'clause') {
        return <>
            {children &&
                <ol start={clauseNumber} key={index}>
                    <li>{parseInput(children[0], 0, params, classes)}</li>
                    {recurse(children.splice(1), params, classes)}
                </ol>}
        </>
    } else if (type === 'ul') {
        return (
            <ul key={index}>
                {children && recurse(children, params, classes)}
            </ul>
        )
    } else if (type === 'li') {
        return (
            <li key={index}>
                {children && recurse(children, params, classes)}
            </li>
        )
    } else if (type === '') {
        return processText(text, bold, underline)
    }
}
