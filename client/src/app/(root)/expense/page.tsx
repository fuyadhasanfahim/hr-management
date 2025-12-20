'use client';

import { useState } from 'react';
import {
    useGetExpensesQuery,
    useGetExpenseStatsQuery,
    useCreateExpenseMutation,
    useUpdateExpenseMutation,
    useDeleteExpenseMutation,
    useGetExpenseCategoriesQuery,
    useCreateExpenseCategoryMutation,
    type Expense,
    type ExpenseCategory,
} from '@/redux/features/expense/expenseApi';
import { useGetAllBranchesQuery } from '@/redux/features/branch/branchApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Loader2, ChevronLeft, ChevronRight, Plus, Trash2, TrendingUp, Calendar, DollarSign, BarChart3, Edit2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ExpenseForm, type ExpenseFormData } from '@/components/expense/ExpenseForm';

const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'paid', label: 'Paid', color: 'text-green-600 bg-green-100' },
    { value: 'partial_paid', label: 'Partial Paid', color: 'text-orange-600 bg-orange-100' },
];

const perPageOptions = [10, 25, 50, 100];

interface Branch {
    _id: string;
    name: string;
}

export default function ExpensePage() {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        search: '',
        month: '',
        branchId: '',
        status: '',
        limit: 10,
        sortBy: 'date',
        sortOrder: 'desc' as 'asc' | 'desc',
    });
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Default form values for edit
    const [editDefaultValues, setEditDefaultValues] = useState<ExpenseFormData | undefined>(undefined);

    // Queries
    const { data: expenseData, isLoading, isFetching } = useGetExpensesQuery({
        ...filters,
        page,
    });
    const { data: stats, isLoading: isLoadingStats } = useGetExpenseStatsQuery(filters.branchId || undefined);
    const { data: categories } = useGetExpenseCategoriesQuery(undefined);
    const { data: branchesData } = useGetAllBranchesQuery(undefined);
    console.log(categories);

    // Mutations
    const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
    const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();
    const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();
    const [createCategory, { isLoading: isCreatingCategory }] = useCreateExpenseCategoryMutation();

    const expenses = expenseData?.expenses || [];
    const pagination = expenseData?.pagination;
    const branches: Branch[] = branchesData?.branches || [];

    const handleFilterChange = (key: string, value: string | number) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const handleCreateExpense = async (data: ExpenseFormData) => {
        try {
            await createExpense({
                ...data,
                amount: parseFloat(data.amount),
            }).unwrap();
            toast.success('Expense created successfully');
            setIsAddDialogOpen(false);
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || 'Failed to create expense');
        }
    };

    const handleUpdateExpense = async (data: ExpenseFormData) => {
        if (!selectedExpense) return;
        try {
            await updateExpense({
                id: selectedExpense._id,
                ...data,
                amount: parseFloat(data.amount),
            }).unwrap();
            toast.success('Expense updated successfully');
            setIsEditDialogOpen(false);
            setSelectedExpense(null);
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || 'Failed to update expense');
        }
    };

    const handleDeleteExpense = async () => {
        if (!selectedExpense) return;
        try {
            await deleteExpense(selectedExpense._id).unwrap();
            toast.success('Expense deleted successfully');
            setIsDeleteDialogOpen(false);
            setSelectedExpense(null);
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || 'Failed to delete expense');
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) {
            toast.error('Category name is required');
            return;
        }
        try {
            await createCategory({ name: newCategoryName }).unwrap();
            toast.success('Category created successfully');
            setIsAddCategoryDialogOpen(false);
            setNewCategoryName('');
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || 'Failed to create category');
        }
    };

    const openEditDialog = (expense: Expense) => {
        setSelectedExpense(expense);
        setEditDefaultValues({
            date: new Date(expense.date),
            title: expense.title,
            categoryId: expense.category?._id || '',
            branchId: expense.branch?._id || '',
            amount: expense.amount.toString(),
            status: expense.status,
            note: expense.note || '',
        });
        setIsEditDialogOpen(true);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Generate month options for the last 12 months
    const getMonthOptions = () => {
        const options = [];
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            options.push({
                value: format(date, 'yyyy-MM'),
                label: format(date, 'MMMM yyyy'),
            });
        }
        return options;
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoadingStats ? (
                    <>
                        {[...Array(4)].map((_, i) => (
                            <Card key={i}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-4" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-8 w-32" />
                                </CardContent>
                            </Card>
                        ))}
                    </>
                ) : (
                    <>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Today&apos;s Expense</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold truncate">{formatCurrency(stats?.today || 0)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold truncate">{formatCurrency(stats?.thisMonth || 0)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">This Year</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold truncate">{formatCurrency(stats?.thisYear || 0)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg Monthly</CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold truncate">{formatCurrency(stats?.avgMonthly || 0)}</div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Main Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className='text-2xl'>Expense Management</CardTitle>
                        <CardDescription>Track and manage company expenses</CardDescription>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus />
                                Add Expense
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add New Expense</DialogTitle>
                                <DialogDescription>Fill in the details to add a new expense</DialogDescription>
                            </DialogHeader>
                            <ExpenseForm
                                onSubmit={handleCreateExpense}
                                isSubmitting={isCreating}
                                categories={categories}
                                branches={branches}
                                onAddCategory={() => setIsAddCategoryDialogOpen(true)}
                                submitLabel="Create"
                                onCancel={() => setIsAddDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full">
                        <Input
                            placeholder="Search by title..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className='w-full'
                        />
                        <Select value={filters.month} onValueChange={(value) => handleFilterChange('month', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="All months" />
                            </SelectTrigger>
                            <SelectContent>
                                {getMonthOptions().map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={filters.branchId} onValueChange={(value) => handleFilterChange('branchId', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="All branches" />
                            </SelectTrigger>
                            <SelectContent>
                                {branches.map((branch) => (
                                    <SelectItem key={branch._id} value={branch._id}>
                                        {branch.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={filters.limit.toString()}
                            onValueChange={(value) => handleFilterChange('limit', parseInt(value))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {perPageOptions.map((opt) => (
                                    <SelectItem key={opt} value={opt.toString()}>
                                        {opt} per page
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setFilters({
                                    search: '',
                                    month: '',
                                    branchId: '',
                                    status: '',
                                    limit: 10,
                                    sortBy: 'date',
                                    sortOrder: 'desc',
                                });
                                setPage(1);
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>

                    {/* Table */}
                    <div className='border'>
                        {isLoading ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='border-r text-center'>Date</TableHead>
                                        <TableHead className='border-r text-center'>Title</TableHead>
                                        <TableHead className='border-r text-center'>Category</TableHead>
                                        <TableHead className='border-r text-center'>Branch</TableHead>
                                        <TableHead className='border-r text-center'>Amount</TableHead>
                                        <TableHead className='border-r text-center'>Status</TableHead>
                                        <TableHead className='border-r text-center'>Note</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...Array(5)].map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell className='border-r'><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell className='border-r'><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell className='border-r'><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell className='border-r'><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell className='border-r'><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                                            <TableCell className='border-r'><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                            <TableCell className='border-r'><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Skeleton className="h-8 w-8" />
                                                    <Skeleton className="h-8 w-8" />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='border-r text-center'>Date</TableHead>
                                        <TableHead className='border-r text-center'>Title</TableHead>
                                        <TableHead className='border-r text-center'>Category</TableHead>
                                        <TableHead className='border-r text-center'>Branch</TableHead>
                                        <TableHead className='border-r text-center'>Amount</TableHead>
                                        <TableHead className='border-r text-center'>Status</TableHead>
                                        <TableHead className='border-r text-center'>Note</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {expenses.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                                No expenses found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        expenses.map((expense: Expense) => {
                                            const statusOpt = statusOptions.find((s) => s.value === expense.status);
                                            return (
                                                <TableRow key={expense._id}>
                                                    <TableCell className='border-r'>{format(new Date(expense.date), 'PPP')}</TableCell>
                                                    <TableCell className="font-medium border-r">{expense.title}</TableCell>
                                                    <TableCell className='border-r'>{expense.category?.name || '-'}</TableCell>
                                                    <TableCell className='border-r'>{expense.branch?.name || '-'}</TableCell>
                                                    <TableCell className="font-medium border-r">
                                                        {formatCurrency(expense.amount)}
                                                    </TableCell>
                                                    <TableCell className='border-r text-center'>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusOpt?.color}`}>
                                                            {statusOpt?.label}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="max-w-[150px] truncate border-r">{expense.note || '-'}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openEditDialog(expense)}
                                                            >
                                                                <Edit2 />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => {
                                                                    setSelectedExpense(expense);
                                                                    setIsDeleteDialogOpen(true);
                                                                }}
                                                            >
                                                                <Trash2 className="text-destructive" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1 || isFetching}
                                >
                                    <ChevronLeft />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                                    disabled={page === pagination.pages || isFetching}
                                >
                                    Next
                                    <ChevronRight />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Expense</DialogTitle>
                        <DialogDescription>Update the expense details</DialogDescription>
                    </DialogHeader>
                    {editDefaultValues && (
                        <ExpenseForm
                            key={selectedExpense?._id}
                            defaultValues={editDefaultValues}
                            onSubmit={handleUpdateExpense}
                            isSubmitting={isUpdating}
                            categories={categories}
                            branches={branches}
                            onAddCategory={() => setIsAddCategoryDialogOpen(true)}
                            submitLabel="Update"
                            onCancel={() => setIsEditDialogOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this expense? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteExpense}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                        >
                            {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Add Category Dialog */}
            <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                        <DialogDescription>Create a new expense category</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="category-name">Category Name *</Label>
                            <Input
                                id="category-name"
                                placeholder="e.g. Office Supplies"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateCategory} disabled={isCreatingCategory}>
                            {isCreatingCategory && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
