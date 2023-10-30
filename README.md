# XML Output Parser for Langchain

## Overview

The XML Output Parser is designed to work with Langchain, providing utilities to parse and validate XML strings against an XSD (XML Schema Definition). The module is intended to structure language model outputs into a more manageable XML format.

Langchain defines output parsers with two essential methods and one optional method. This module fully conforms to that specification.

## Installation

To install the module, add it to your `package.json` or install it manually using npm or yarn.

```bash
npm install langchain-xml-parser 
```

## Usage

To use this module in your Langchain project, you'll need to import it as follows:

```javascript
const {
  XMLParseException,
  XMLValidator,
  XMLOutputParser
} = require('langchain-xml-parser');
```

### XMLParseException

This is a custom exception class derived from `OutputParserException`. It's thrown when XML parsing fails.

```javascript
const ex = new XMLParseException('some error', 'some text');
```

### XMLValidator

A utility class with a static method for validating XML content against an XSD schema.

```javascript
const isValid = XMLValidator.validateAgainstXSD(xmlString, xsdString);
```

### XMLOutputParser

This class conforms to Langchain's output parser specifications and uses an XSD schema for its operations.

```javascript
const parser = new XMLOutputParser(xsdString);
```

#### Methods

- `getFormatInstructions()`: This method returns a string containing instructions on how the language model's output should be formatted.
  
- `async parse(xmlText)`: This is an asynchronous method that takes a string as input, validates it against the provided XSD schema, and returns the original string if it's valid.

## License

MIT
