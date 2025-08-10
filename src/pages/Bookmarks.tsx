import React, { useState } from "react";
import { useBookmarks } from "@/contexts/BookmarksContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, Search, Calendar, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Bookmarks = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookmark, setSelectedBookmark] = useState<any>(null);
  const { bookmarks } = useBookmarks();

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Reports": "bg-blue-100 text-blue-800",
      "Documentation": "bg-green-100 text-green-800",
      "Process": "bg-purple-100 text-purple-800",
      "Templates": "bg-orange-100 text-orange-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-blue p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate("/chat")}
            variant="outline"
            size="icon"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-bold text-white">Bookmarks</h1>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0 mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Bookmark className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Saved Items</CardTitle>
                <CardDescription>Access your bookmarked conversations, resources, and important information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {filteredBookmarks.map((bookmark) => (
            <Card 
              key={bookmark.id} 
              className="bg-white/95 backdrop-blur-sm shadow-elegant border-0 hover:shadow-lg transition-all duration-300 hover-scale cursor-pointer"
              onClick={() => setSelectedBookmark(bookmark)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{bookmark.title}</h3>
                      <Badge className={getCategoryColor(bookmark.category)}>
                        {bookmark.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{bookmark.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {bookmark.date}
                      </div>
                      <span>•</span>
                      <span className="capitalize">{bookmark.type}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredBookmarks.length === 0 && (
            <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0">
              <CardContent className="p-8 text-center">
                <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No bookmarks found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try adjusting your search terms" : "Start bookmarking important conversations and resources"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bookmark Detail Dialog */}
        <Dialog open={!!selectedBookmark} onOpenChange={() => setSelectedBookmark(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedBookmark && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <DialogTitle className="text-xl">{selectedBookmark.title}</DialogTitle>
                      <Badge className={getCategoryColor(selectedBookmark.category)}>
                        {selectedBookmark.category}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedBookmark(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <DialogDescription className="text-left">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {selectedBookmark.date}
                      </div>
                      <span>•</span>
                      <span className="capitalize">{selectedBookmark.type}</span>
                    </div>
                    {selectedBookmark.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-6">
                  <h4 className="font-medium mb-3 text-foreground">Content:</h4>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{selectedBookmark.content}</p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Bookmarks;