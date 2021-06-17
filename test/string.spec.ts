import {
  normalizeGreek,
  camelize,
  toTitleCase,
  toSentence,
  makeLines,
  nl2br,
  removeAllWhitespaces,
  decodeHtmlCharCodes,
  toJsonIntended,
  format,
  translateBool,
  quoteSingle,
  quoteDouble,
  quoteBacktick,
  quoteLRSingle,
  quoteLRDouble,
  quote,
  quoteIf,
  numToSSColumn,
} from '../src/string';
import { spreadsheetColumnNumbers } from './string.helpers';

describe('utils/string', () => {
  it('should normalize greek (normalizeGreek)', () => {
    const testStrings = [
      ['Δοκιμή', 'Δοκιμη'],
      ['Αλφαριθμητικό', 'Αλφαριθμητικο'],
      ['Απελπισία', 'Απελπισια'],
      ['Τσαρούχια', 'Τσαρουχια'],
      ['ΠΟΔΌΣΦΑΙΡΟ', 'ΠΟΔΟΣΦΑΙΡΟ'],
      ['ΚΑΛΆΘΙ', 'ΚΑΛΑΘΙ'],
      ['ΦΑΚΈΣ', 'ΦΑΚΕΣ'],
      ['ΆΈΉΊΌΎΏάέήίόύώ', 'ΑΕΗΙΟΥΩαεηιουω'],
    ];

    testStrings.forEach(([marked, unmarked]) => {
      expect(normalizeGreek(marked)).toBe(unmarked);
    });
  });

  it('should camelize a string (camelize)', () => {
    expect(camelize('This is a test')).toBe('ThisIsATest');
    expect(camelize('This-is-a-test', true)).toBe('thisIsATest');
    expect(camelize('This_is_a_test', true)).toBe('thisIsATest');
  });

  it('should title case a string (toTitleCase)', () => {
    expect(toTitleCase('This is a test')).toBe('This Is A Test');
    expect(toTitleCase('some plain text')).toBe('Some Plain Text');
  });

  it('should sentence a string (toSentence)', () => {
    expect(toSentence('SOME CAPS TEXT')).toBe('Some caps text');
    expect(toSentence('this Is Some TEST')).toBe('This is some test');
  });

  it('should make some lines (makeLines)', () => {
    expect(makeLines({ lines: ['one', 'two', 'three'] })).toBe(
      'one\ntwo\nthree'
    );
    expect(
      makeLines({ lines: ['many', 'strings', 'inarray'] }, { glue: '\r\n' })
    ).toBe('many\r\nstrings\r\ninarray');
  });

  it('should convert nl to br (nl2br)', () => {
    expect(nl2br('Some\ntext\nwith\nlines')).toBe(
      'Some<br/>text<br/>with<br/>lines'
    );
    expect(nl2br('Some\r\nwindows\r\nlines\r\n')).toBe(
      'Some\r<br/>windows\r<br/>lines\r<br/>'
    );
  });

  it('should remove all whitespaces from a string (removeAllWhitespaces)', () => {
    expect(removeAllWhitespaces('   Text   With Witespaces  ')).toBe(
      'TextWithWitespaces'
    );
    expect(removeAllWhitespaces('\t\t\tText\t\t\tWith\tWitespaces\t\t')).toBe(
      'TextWithWitespaces'
    );
    expect(removeAllWhitespaces(' \t\t  Text   With \tWitespaces\t   \t')).toBe(
      'TextWithWitespaces'
    );
  });

  it('should decode HTML charcodes (decodeHtmlCharCodes)', () => {
    expect(decodeHtmlCharCodes('This&#32;is&#10;some&#32;text')).toBe(
      'This is\nsome text'
    );
    expect(
      decodeHtmlCharCodes(
        'Test in greek is &#8220;&#916;&#959;&#954;&#953;&#956;&#942;&#8221;'
      )
    ).toBe('Test in greek is “Δοκιμή”');
  });

  it('should intend with JSON.stringify (toJsonIntended)', () => {
    expect(toJsonIntended({ some: 'Some', one: 1 })).toBe(
      `{
  "some": "Some",
  "one": 1
}`
    );
  });

  it('should format a string (format)', () => {
    expect(
      format('My name is {name} and my IQ is {IQ}', {
        name: 'Christos',
        IQ: 111,
      })
    ).toBe('My name is Christos and my IQ is 111');
    expect(
      format('Format using an {0} and the {1} of the {0}', ['array', 'indexes'])
    ).toBe('Format using an array and the indexes of the array');
  });

  it('should translate a boolean like string (translateBool)', () => {
    const truthyStrings = ['true', 'yes', 'on', 'True', 'Yes', 'On'];
    const falsyStrings = ['false', 'no', 'off', 'False', 'No', 'Off'];

    truthyStrings.forEach((str) => {
      expect(translateBool(str)).toBe(true);
    });

    falsyStrings.forEach((str) => {
      expect(translateBool(str)).toBe(false);
    });
  });

  it('should quote (quoteSingle, quoteDouble, quoteBacktick, quoteLRSingle, quoteLRDouble, quote, quoteIf)', () => {
    expect(quoteSingle('test')).toBe("'test'");
    expect(quoteDouble('test')).toBe('"test"');
    expect(quoteBacktick('test')).toBe('`test`');
    expect(quoteLRSingle('test')).toBe('‘test’');
    expect(quoteLRDouble('test')).toBe('“test”');

    expect(quote('test', 'single')).toBe("'test'");
    expect(quote('test', 'double')).toBe('"test"');
    expect(quote('test', 'backtick')).toBe('`test`');
    expect(quote('test', 'lrsingle')).toBe('‘test’');
    expect(quote('test', 'lrdouble')).toBe('“test”');

    expect(quoteIf('', 'single')).toBe('');
    expect(quoteIf('test', 'single')).toBe("'test'");
  });

  it('should convert numbers to spreadsheet columns (numToSSColumn)', () => {
    for (let i = 0; i < spreadsheetColumnNumbers.length; i++) {
      const check = spreadsheetColumnNumbers[i];
      expect(numToSSColumn(i + 1)).toBe(check);
    }
  });
});
