import React, { useState } from 'react';
import { ArrowLeft, Plus, Folder, Search, Calendar, MessageSquare, Edit2, Trash2, Users } from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  description: string;
  color: string;
  createdDate: string;
  chatCount: number;
  lastActivity: string;
  isShared: boolean;
}

interface WorkspacesPageProps {
  onBack: () => void;
  workspaces: Workspace[];
  onCreateWorkspace: (workspace: Omit<Workspace, 'id' | 'createdDate' | 'chatCount' | 'lastActivity'>) => void;
  onSelectWorkspace: (workspaceId: string) => void;
  onEditWorkspace: (workspaceId: string, updates: Partial<Workspace>) => void;
  onDeleteWorkspace: (workspaceId: string) => void;
}

const WorkspacesPage: React.FC<WorkspacesPageProps> = ({ 
  onBack, 
  workspaces, 
  onCreateWorkspace, 
  onSelectWorkspace,
  onEditWorkspace,
  onDeleteWorkspace
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    isShared: false
  });

  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
  ];

  // Filter workspaces based on search term
  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workspace.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspace.name.trim()) return;
    
    onCreateWorkspace(newWorkspace);
    setNewWorkspace({
      name: '',
      description: '',
      color: '#3B82F6',
      isShared: false
    });
    setShowCreateModal(false);
  };

  const handleEditWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkspace || !editingWorkspace.name.trim()) return;
    
    onEditWorkspace(editingWorkspace.id, {
      name: editingWorkspace.name,
      description: editingWorkspace.description,
      color: editingWorkspace.color,
      isShared: editingWorkspace.isShared
    });
    setEditingWorkspace(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="w-12 h-12 bg-slate-600 hover:bg-slate-500 rounded-full flex items-center justify-center text-white transition-colors mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-4xl font-bold text-white">Workspaces</h1>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Workspace</span>
          </button>
        </div>

        {/* Workspaces Section */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Folder className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Your Workspaces</h2>
              <p className="text-gray-600">Organize your conversations by project, topic, or team</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search workspaces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Workspaces Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkspaces.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {searchTerm ? 'No workspaces found' : 'No workspaces yet'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Create your first workspace to organize your conversations'
                  }
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Create Workspace
                  </button>
                )}
              </div>
            ) : (
              filteredWorkspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer border-l-4 group"
                  style={{ borderLeftColor: workspace.color }}
                  onClick={() => onSelectWorkspace(workspace.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: workspace.color }}
                      >
                        <Folder className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{workspace.name}</h3>
                        {workspace.isShared && (
                          <div className="flex items-center space-x-1 text-sm text-blue-600">
                            <Users className="w-3 h-3" />
                            <span>Shared</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingWorkspace(workspace);
                        }}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this workspace?')) {
                            onDeleteWorkspace(workspace.id);
                          }
                        }}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm">{workspace.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{workspace.chatCount} chats</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(workspace.lastActivity)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Create New Workspace</h3>
            
            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={newWorkspace.name}
                  onChange={(e) => setNewWorkspace(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter workspace name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newWorkspace.description}
                  onChange={(e) => setNewWorkspace(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this workspace is for"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewWorkspace(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newWorkspace.color === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isShared"
                  checked={newWorkspace.isShared}
                  onChange={(e) => setNewWorkspace(prev => ({ ...prev, isShared: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isShared" className="ml-2 text-sm text-gray-700">
                  Make this workspace shared
                </label>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Workspace Modal */}
      {editingWorkspace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Edit Workspace</h3>
            
            <form onSubmit={handleEditWorkspace} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={editingWorkspace.name}
                  onChange={(e) => setEditingWorkspace(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                  placeholder="Enter workspace name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editingWorkspace.description}
                  onChange={(e) => setEditingWorkspace(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                  placeholder="Describe what this workspace is for"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setEditingWorkspace(prev => prev ? ({ ...prev, color }) : null)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        editingWorkspace.color === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsShared"
                  checked={editingWorkspace.isShared}
                  onChange={(e) => setEditingWorkspace(prev => prev ? ({ ...prev, isShared: e.target.checked }) : null)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="editIsShared" className="ml-2 text-sm text-gray-700">
                  Make this workspace shared
                </label>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingWorkspace(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspacesPage;