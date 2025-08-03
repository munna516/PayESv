"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Loading from "@/components/Loading/Loading";

export default function Blogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => fetch("/api/admin/blogs").then((res) => res.json()),
  });

  const [formData, setFormData] = useState({
    thumbnail: "",
    title: "",
    description: "",
    date: new Date(),
    status: "active",
  });
  if (isLoading) return <Loading />;
  const blogs = data?.rows || [];

  const filteredBlogs = blogs
    ?.filter((blog) => {
      const matchesSearch = blog.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || blog.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => b.date - a.date);

  const handleAddNew = () => {
    setSelectedBlog(null);
    setFormData({
      thumbnail: "",
      title: "",
      description: "",
      date: new Date(),
      status: "active",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (blog, id) => {
    setSelectedBlog(blog);
    setSelectedBlogId(id);
    setFormData({
      thumbnail: blog.thumbnail,
      title: blog.title,
      description: blog.description,
      date: blog.date,
      status: blog.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this blog?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(`/api/admin/blogs`, {
          method: "DELETE",
          body: JSON.stringify({ id }),
        });
        const data = await response.json();
        if (data?.rowCount > 0) {
          Swal.fire({
            title: "Deleted!",
            text: "Your blog has been deleted.",
            icon: "success",
          });
          refetch();
        } else {
          toast.error("Failed to delete blog");
        }
      }
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (selectedBlog) {
      const response = await fetch(`/api/admin/blogs`, {
        method: "PUT",
        body: JSON.stringify({ ...formData, id: selectedBlogId }),
      });
      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Blog updated successfully");
      }
      refetch();
    } else {
      const response = await fetch("/api/admin/blogs", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Blog created successfully");
      }
      refetch();
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="mb-16">
      <Card className="dark:bg-slate-700">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Blogs</CardTitle>
          <Button
            variant="primary"
            onClick={handleAddNew}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "primary" : "outline"}
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "deactive" ? "primary" : "outline"}
                onClick={() => setStatusFilter("deactive")}
              >
                Deactive
              </Button>
            </div>
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {blogs?.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Post Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlogs?.map((blog, index) => (
                    <TableRow key={blog.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <p className="font-medium">
                            {blog.title.slice(0, 30)} ....
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {blog.description.slice(0, 80)} ...
                        </p>
                      </TableCell>
                      <TableCell>
                        {format(new Date(blog.date), "dd-MM-yyyy")}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            blog.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }`}
                        >
                          {blog.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(blog, blog.id)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4 dark:text-white" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(blog.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <h1>No blogs found</h1>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] dark:bg-slate-700">
          <DialogHeader>
            <DialogTitle>
              {selectedBlog ? "Edit Blog" : "Add New Blog"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="thumbnail">Thumbnail Image Link</Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail}
                required={true}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                required
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                required
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                placeholder="Enter blog description..."
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2 w-full">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="deactive">Deactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {selectedBlog ? "Save changes" : "Add Blog"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
