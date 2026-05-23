import { cn } from '@utils';
import { type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes, forwardRef } from 'react';
import styles from './Table.module.css';

export type TableProps = HTMLAttributes<HTMLTableElement>;
export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;
export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;
export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;
export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;
export type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;
export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

export const Table = forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => {
  return (
    <div className={styles.container}>
      <table ref={ref} className={cn(styles.table, className)} {...props} />
    </div>
  );
});
Table.displayName = 'Table';

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(({ className, ...props }, ref) => {
  return <thead ref={ref} className={cn(styles.header, className)} {...props} />;
});
TableHeader.displayName = 'TableHeader';

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(({ className, ...props }, ref) => {
  return <tbody ref={ref} className={cn(styles.body, className)} {...props} />;
});
TableBody.displayName = 'TableBody';

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(({ className, ...props }, ref) => {
  return <tfoot ref={ref} className={cn(styles.footer, className)} {...props} />;
});
TableFooter.displayName = 'TableFooter';

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(({ className, ...props }, ref) => {
  return <tr ref={ref} className={cn(styles.row, className)} {...props} />;
});
TableRow.displayName = 'TableRow';

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(({ className, ...props }, ref) => {
  return <th ref={ref} className={cn(styles.head, className)} {...props} />;
});
TableHead.displayName = 'TableHead';

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(({ className, ...props }, ref) => {
  return <td ref={ref} className={cn(styles.cell, className)} {...props} />;
});
TableCell.displayName = 'TableCell';
