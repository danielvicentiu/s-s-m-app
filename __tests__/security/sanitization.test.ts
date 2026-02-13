/**
 * Input Sanitization Test Suite
 *
 * Tests comprehensive input sanitization functionality including:
 * - Script tag removal
 * - Event handler stripping
 * - SQL injection prevention
 * - Path traversal protection
 * - XSS prevention in search queries
 * - Deep object sanitization
 * - Safe HTML preservation
 */

import {
  sanitizeHtml,
  escapeSql,
  sanitizeFilename,
  sanitizeSearchQuery,
  deepSanitize,
  preserveSafeHtml,
} from '@/lib/security/sanitization'

describe('Input Sanitization Security Tests', () => {
  /**
   * TEST 1: Strips script tags from HTML input
   */
  describe('sanitizeHtml - Script Tag Removal', () => {
    it('should strip script tags and their content', () => {
      const maliciousInput = 'Hello <script>alert("XSS")</script> World'
      const result = sanitizeHtml(maliciousInput)

      expect(result).toBe('Hello  World')
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('alert')
    })

    it('should strip multiple script tags', () => {
      const maliciousInput = '<script>alert(1)</script>Text<script>alert(2)</script>'
      const result = sanitizeHtml(maliciousInput)

      expect(result).toBe('Text')
      expect(result).not.toContain('<script>')
    })

    it('should handle script tags with attributes', () => {
      const maliciousInput = '<script type="text/javascript" src="evil.js">alert("XSS")</script>'
      const result = sanitizeHtml(maliciousInput)

      expect(result).toBe('')
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('evil.js')
    })

    it('should handle case-insensitive script tags', () => {
      const maliciousInput = '<SCRIPT>alert("XSS")</SCRIPT><ScRiPt>alert("XSS")</ScRiPt>'
      const result = sanitizeHtml(maliciousInput)

      expect(result).toBe('')
      expect(result).not.toContain('SCRIPT')
      expect(result).not.toContain('ScRiPt')
    })
  })

  /**
   * TEST 2: Strips event handlers from HTML
   */
  describe('sanitizeHtml - Event Handler Removal', () => {
    it('should remove onclick event handlers', () => {
      const maliciousInput = '<div onclick="alert(\'XSS\')">Click me</div>'
      const result = sanitizeHtml(maliciousInput)

      expect(result).not.toContain('onclick')
      expect(result).toContain('<div')
      expect(result).toContain('Click me')
      expect(result).toContain('</div>')
    })

    it('should remove various event handlers', () => {
      const maliciousInput = `
        <img src="x" onerror="alert('XSS')">
        <body onload="alert('XSS')">
        <input onfocus="alert('XSS')">
        <div onmouseover="alert('XSS')">Hover</div>
      `
      const result = sanitizeHtml(maliciousInput)

      expect(result).not.toContain('onerror')
      expect(result).not.toContain('onload')
      expect(result).not.toContain('onfocus')
      expect(result).not.toContain('onmouseover')
      expect(result).not.toContain('alert')
    })

    it('should remove event handlers with different quote styles', () => {
      const maliciousInput = `
        <div onclick="alert('XSS')">Single quotes</div>
        <div onclick='alert("XSS")'>Double quotes</div>
        <div onclick=alert(1)>No quotes</div>
      `
      const result = sanitizeHtml(maliciousInput)

      expect(result).not.toContain('onclick')
      expect(result).not.toContain('alert')
    })

    it('should remove javascript: protocol', () => {
      const maliciousInput = '<a href="javascript:alert(\'XSS\')">Click</a>'
      const result = sanitizeHtml(maliciousInput)

      expect(result).not.toContain('javascript:')
      expect(result).toContain('<a href="')
      expect(result).toContain('Click')
    })
  })

  /**
   * TEST 3: Escapes SQL injection attempts
   */
  describe('escapeSql - SQL Injection Prevention', () => {
    it('should escape single quotes to prevent SQL injection', () => {
      const sqlInjection = "admin' OR '1'='1"
      const result = escapeSql(sqlInjection)

      expect(result).toBe("admin'' OR ''1''=''1")
      // Note: SQL escaping doubles quotes, so '' will still contain single quotes
      expect(result).toContain("''")
    })

    it('should escape backslashes', () => {
      const input = "test\\escape"
      const result = escapeSql(input)

      expect(result).toBe("test\\\\escape")
    })

    it('should escape null bytes', () => {
      const input = "test\0null"
      const result = escapeSql(input)

      expect(result).toBe("test\\0null")
      expect(result).not.toContain('\0')
    })

    it('should escape newlines and carriage returns', () => {
      const input = "line1\nline2\rline3"
      const result = escapeSql(input)

      expect(result).toBe("line1\\nline2\\rline3")
      expect(result).not.toContain('\n')
      expect(result).not.toContain('\r')
    })

    it('should handle complex SQL injection attempts', () => {
      const sqlInjection = "'; DROP TABLE users; --"
      const result = escapeSql(sqlInjection)

      expect(result).toBe("''; DROP TABLE users; --")
      expect(result).toContain("''")
    })
  })

  /**
   * TEST 4: Prevents path traversal in filenames
   */
  describe('sanitizeFilename - Path Traversal Prevention', () => {
    it('should remove directory traversal sequences', () => {
      const maliciousFilename = '../../etc/passwd'
      const result = sanitizeFilename(maliciousFilename)

      expect(result).toBe('etcpasswd')
      expect(result).not.toContain('..')
      expect(result).not.toContain('/')
    })

    it('should remove backslashes and forward slashes', () => {
      const maliciousFilename = '..\\..\\windows\\system32\\config'
      const result = sanitizeFilename(maliciousFilename)

      expect(result).toBe('windowssystem32config')
      expect(result).not.toContain('\\')
      expect(result).not.toContain('/')
      expect(result).not.toContain('..')
    })

    it('should remove leading and trailing dots', () => {
      const maliciousFilename = '...malicious...'
      const result = sanitizeFilename(maliciousFilename)

      expect(result).toBe('malicious')
      expect(result).not.toMatch(/^\./)
      expect(result).not.toMatch(/\.$/)
    })

    it('should remove null bytes from filenames', () => {
      const maliciousFilename = 'file.txt\0.jpg'
      const result = sanitizeFilename(maliciousFilename)

      expect(result).toBe('file.txt.jpg')
      expect(result).not.toContain('\0')
    })

    it('should handle complex path traversal attempts', () => {
      const maliciousFilename = '....//....//etc/passwd'
      const result = sanitizeFilename(maliciousFilename)

      expect(result).toBe('etcpasswd')
      expect(result).not.toContain('/')
      expect(result).not.toContain('..')
    })
  })

  /**
   * TEST 5: Sanitizes search queries to prevent XSS
   */
  describe('sanitizeSearchQuery - XSS Prevention in Search', () => {
    it('should escape HTML special characters', () => {
      const maliciousSearch = '<script>alert("XSS")</script>'
      const result = sanitizeSearchQuery(maliciousSearch)

      // Tags are removed first, then remaining content is escaped
      expect(result).toBe('alert(&quot;XSS&quot;)')
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('>')
      expect(result).toContain('&quot;')
    })

    it('should escape quotes and ampersands', () => {
      const search = 'Company & "Name" with \'quotes\''
      const result = sanitizeSearchQuery(search)

      expect(result).toContain('&amp;')
      expect(result).toContain('&quot;')
      expect(result).toContain('&#x27;')
      // Note: Escaped entities will still contain & as part of the escape sequence
      expect(result).not.toContain('"')
      expect(result.replace(/&#x27;/g, '')).not.toContain("'")
    })

    it('should remove all HTML tags', () => {
      const search = '<b>Bold</b> <i>Italic</i> text'
      const result = sanitizeSearchQuery(search)

      expect(result).not.toContain('<b>')
      expect(result).not.toContain('</b>')
      expect(result).not.toContain('<i>')
      expect(result).toContain('Bold')
      expect(result).toContain('Italic')
    })

    it('should handle complex XSS attempts', () => {
      const maliciousSearch = '<img src=x onerror="alert(1)">'
      const result = sanitizeSearchQuery(maliciousSearch)

      // Tags are removed, so only empty string remains
      expect(result).toBe('')
      expect(result).not.toContain('<img')
      expect(result).not.toContain('onerror')
    })
  })

  /**
   * TEST 6: Deep sanitizes nested objects
   */
  describe('deepSanitize - Nested Object Sanitization', () => {
    it('should sanitize all string values in nested object', () => {
      const maliciousObject = {
        name: '<script>alert("XSS")</script>John',
        profile: {
          bio: '<script>alert("XSS")</script>Developer',
          skills: ['JavaScript<script>alert(1)</script>', 'React'],
        },
        metadata: {
          tags: {
            primary: '<script>alert(2)</script>',
          },
        },
      }

      const result = deepSanitize(maliciousObject)

      expect(result.name).toBe('John')
      expect(result.name).not.toContain('<script>')
      expect(result.profile.bio).toBe('Developer')
      expect(result.profile.bio).not.toContain('<script>')
      expect(result.profile.skills[0]).toBe('JavaScript')
      expect(result.profile.skills[0]).not.toContain('<script>')
      expect(result.metadata.tags.primary).toBe('')
      expect(result.metadata.tags.primary).not.toContain('<script>')
    })

    it('should handle arrays of objects', () => {
      const maliciousArray = [
        { name: '<script>alert(1)</script>User1' },
        { name: '<script>alert(2)</script>User2' },
      ]

      const result = deepSanitize(maliciousArray)

      expect(result[0].name).toBe('User1')
      expect(result[1].name).toBe('User2')
      expect(result[0].name).not.toContain('<script>')
      expect(result[1].name).not.toContain('<script>')
    })

    it('should preserve non-string values', () => {
      const obj = {
        name: '<script>alert(1)</script>Test',
        age: 25,
        active: true,
        score: 99.5,
        data: null,
        items: [1, 2, 3],
      }

      const result = deepSanitize(obj)

      expect(result.name).toBe('Test')
      expect(result.age).toBe(25)
      expect(result.active).toBe(true)
      expect(result.score).toBe(99.5)
      expect(result.data).toBeNull()
      expect(result.items).toEqual([1, 2, 3])
    })

    it('should allow custom sanitization function', () => {
      const obj = {
        search: '<b>query</b>',
        nested: {
          search: '<i>nested query</i>',
        },
      }

      const result = deepSanitize(obj, sanitizeSearchQuery)

      // sanitizeSearchQuery removes tags first, then escapes remaining text
      expect(result.search).toBe('query')
      expect(result.nested.search).toBe('nested query')
      expect(result.search).not.toContain('<')
      expect(result.nested.search).not.toContain('<')
    })
  })

  /**
   * TEST 7: Preserves safe HTML tags
   */
  describe('preserveSafeHtml - Safe HTML Preservation', () => {
    it('should preserve safe HTML tags', () => {
      const safeHtml = '<p>Paragraph</p><strong>Bold</strong><em>Italic</em><br><a href="http://example.com">Link</a>'
      const result = preserveSafeHtml(safeHtml)

      expect(result).toContain('<p>')
      expect(result).toContain('<strong>')
      expect(result).toContain('<em>')
      expect(result).toContain('<br>')
      expect(result).toContain('<a href=')
      expect(result).toContain('Paragraph')
      expect(result).toContain('Bold')
    })

    it('should remove dangerous tags while preserving safe ones', () => {
      const mixedHtml = '<p>Safe paragraph</p><script>alert("XSS")</script><strong>Bold text</strong>'
      const result = preserveSafeHtml(mixedHtml)

      expect(result).toContain('<p>')
      expect(result).toContain('<strong>')
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('alert')
      expect(result).toContain('Safe paragraph')
      expect(result).toContain('Bold text')
    })

    it('should remove iframe and object tags', () => {
      const dangerousHtml = '<p>Text</p><iframe src="evil.com"></iframe><object data="evil.swf"></object>'
      const result = preserveSafeHtml(dangerousHtml)

      expect(result).toContain('<p>Text</p>')
      expect(result).not.toContain('<iframe>')
      expect(result).not.toContain('<object>')
      expect(result).not.toContain('evil.com')
    })

    it('should remove event handlers from safe tags', () => {
      const htmlWithEvents = '<p onclick="alert(1)">Click me</p><a href="http://example.com" onmouseover="alert(2)">Link</a>'
      const result = preserveSafeHtml(htmlWithEvents)

      expect(result).not.toContain('onclick')
      expect(result).not.toContain('onmouseover')
      expect(result).not.toContain('alert')
      expect(result).toContain('<p>')
      expect(result).toContain('<a href=')
      expect(result).toContain('Click me')
    })

    it('should remove form elements', () => {
      const formHtml = '<p>Text</p><form><input type="text"><button>Submit</button></form>'
      const result = preserveSafeHtml(formHtml)

      expect(result).toContain('<p>Text</p>')
      expect(result).not.toContain('<form>')
      expect(result).not.toContain('<input>')
      expect(result).not.toContain('<button>')
    })
  })

  /**
   * TEST 8: Handles null and undefined values
   */
  describe('Sanitization - Null/Undefined Handling', () => {
    it('should handle null input in sanitizeHtml', () => {
      const result = sanitizeHtml(null as any)
      expect(result).toBe('')
    })

    it('should handle undefined input in sanitizeHtml', () => {
      const result = sanitizeHtml(undefined as any)
      expect(result).toBe('')
    })

    it('should handle empty string in sanitizeHtml', () => {
      const result = sanitizeHtml('')
      expect(result).toBe('')
    })

    it('should handle null in escapeSql', () => {
      const result = escapeSql(null as any)
      expect(result).toBe('')
    })

    it('should handle null in sanitizeFilename', () => {
      const result = sanitizeFilename(null as any)
      expect(result).toBe('')
    })

    it('should handle null in sanitizeSearchQuery', () => {
      const result = sanitizeSearchQuery(null as any)
      expect(result).toBe('')
    })

    it('should handle null in deepSanitize', () => {
      const result = deepSanitize(null)
      expect(result).toBeNull()
    })

    it('should handle undefined in deepSanitize', () => {
      const result = deepSanitize(undefined)
      expect(result).toBeUndefined()
    })

    it('should handle object with null values in deepSanitize', () => {
      const obj = {
        name: 'Test',
        value: null,
        nested: {
          data: undefined,
          text: 'Hello',
        },
      }

      const result = deepSanitize(obj)

      expect(result.name).toBe('Test')
      expect(result.value).toBeNull()
      expect(result.nested.data).toBeUndefined()
      expect(result.nested.text).toBe('Hello')
    })
  })
})
