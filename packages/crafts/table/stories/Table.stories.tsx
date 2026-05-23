import type { Story } from '@ladle/react';
import { useState } from 'react';
import { PairedInput, Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '../src';
import styles from './Table.stories.module.css';

type Alias = {
  name: string;
  command: string;
};

type AliasPreview = {
  items: Alias[];
  skippedLines: string[];
};

const initialAliases: Alias[] = [
  {
    name: 'gst',
    command: 'git status',
  },
  {
    name: 'gco',
    command: 'git checkout',
  },
  {
    name: 'll',
    command: 'eza -la --git',
  },
  {
    name: 'k',
    command: 'kubectl',
  },
  {
    name: 'py',
    command: 'python3',
  },
];

const stripOuterQuotes = (value: string) => {
  const trimmed = value.trim();
  const quote = trimmed[0];

  if ((quote === '"' || quote === "'") && trimmed[trimmed.length - 1] === quote) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
};

const parseAliasLine = (line: string): Alias | null => {
  const parts = line.split('=');

  if (parts.length !== 2) {
    return null;
  }

  const name = stripOuterQuotes(parts[0]);
  const command = stripOuterQuotes(parts[1]);

  if (!name || !command) {
    return null;
  }

  return { name, command };
};

const parseAliasPaste = (text: string): AliasPreview => {
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  return lines.reduce<AliasPreview>(
    (result, line) => {
      const alias = parseAliasLine(line);

      if (alias) {
        result.items.push(alias);
      } else {
        result.skippedLines.push(line);
      }

      return result;
    },
    { items: [], skippedLines: [] },
  );
};

export const Default: Story = () => {
  const [aliases, setAliases] = useState(initialAliases);
  const [preview, setPreview] = useState<AliasPreview | null>(null);

  return (
    <Table>
      <TableHeader>
        <TableRow className={styles.visuallyHidden}>
          <TableHead>Alias name</TableHead>
          <TableHead>Command</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {aliases.map((alias, index) => (
          <TableRow key={`${alias.name}-${index}`}>
            <TableCell style={{ width: '250px', color: 'oklch(0.623 0.214 259.815)' }} className={styles.aliasName}>
              {alias.name}
            </TableCell>
            <TableCell className={styles.command}>{alias.command}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className={styles.formFooter}>
        {preview && (
          <>
            <TableRow className={styles.previewSummaryRow}>
              <TableCell colSpan={2}>
                <div className={styles.previewSummary}>
                  <span>{preview.items.length} aliases detected</span>
                  {preview.skippedLines.length > 0 && <span>{preview.skippedLines.length} lines skipped</span>}
                </div>
              </TableCell>
            </TableRow>
            {preview.items.map((alias, index) => (
              <TableRow key={`${alias.name}-${index}`} className={styles.previewRow}>
                <TableCell className={styles.previewAliasName}>{alias.name}</TableCell>
                <TableCell className={styles.previewCommand}>{alias.command}</TableCell>
              </TableRow>
            ))}
            {preview.skippedLines.length > 0 && (
              <TableRow className={styles.previewSkippedRow}>
                <TableCell colSpan={2}>Skipped: {preview.skippedLines.join(', ')}</TableCell>
              </TableRow>
            )}
            <TableRow className={styles.previewActionRow}>
              <TableCell colSpan={2}>
                <div className={styles.previewActions}>
                  <button
                    className={styles.primaryButton}
                    type='button'
                    onClick={() => {
                      setAliases(prev => [...prev, ...preview.items]);
                      setPreview(null);
                    }}
                  >
                    Add {preview.items.length} aliases
                  </button>
                  <button className={styles.cancelButton} type='button' onClick={() => setPreview(null)}>
                    Cancel
                  </button>
                </div>
              </TableCell>
            </TableRow>
          </>
        )}
        <PairedInput>
          {({ values, setValues }) => (
            <TableRow className={styles.formRow}>
              <TableCell className={styles.aliasInputCell}>
                <input
                  value={values.first}
                  onPaste={e => {
                    const text = e.clipboardData.getData('text');
                    const lines = text
                      .split(/\r?\n/)
                      .map(line => line.trim())
                      .filter(Boolean);

                    if (lines.length > 1) {
                      const nextPreview = parseAliasPaste(text);

                      if (nextPreview.items.length > 0) {
                        e.preventDefault();
                        setPreview(nextPreview);
                        return;
                      }
                    }

                    const parts = text.split('=');

                    if (parts.length === 2) {
                      e.preventDefault();
                      setPreview(null);
                      setValues.first(stripOuterQuotes(parts[0]));
                      setValues.second(stripOuterQuotes(parts[1]));
                    }
                  }}
                  onChange={e => setValues.first(e.target.value)}
                  className={styles.input}
                  placeholder='alias name'
                  aria-label='Alias name'
                />
              </TableCell>
              <TableCell>
                <div className={styles.commandInputGroup}>
                  <input
                    value={values.second}
                    onChange={e => setValues.second(e.target.value)}
                    className={styles.input}
                    placeholder='command'
                    aria-label='Command'
                  />
                  <button
                    className={`${styles.primaryButton} ${styles.iconButton}`}
                    type='button'
                    aria-label='Add alias'
                    onClick={() => {
                      const name = values.first.trim();
                      const command = values.second.trim();

                      if (!name || !command) {
                        return;
                      }

                      setAliases(prev => [...prev, { name, command }]);
                      setValues.first('');
                      setValues.second('');
                      setPreview(null);
                    }}
                  >
                    +
                  </button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </PairedInput>
      </TableFooter>
    </Table>
  );
};
