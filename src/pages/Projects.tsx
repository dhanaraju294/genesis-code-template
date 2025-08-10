import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FolderOpen, Plus, Calendar, Users, BarChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Projects = () => {
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      name: "Client Dashboard Redesign",
      description: "Complete overhaul of the client portal interface to improve user experience",
      status: "In Progress",
      progress: 75,
      dueDate: "2024-02-15",
      team: ["Alice", "Bob", "Charlie"],
      priority: "High"
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "Native mobile application for iOS and Android platforms",
      status: "Planning",
      progress: 25,
      dueDate: "2024-03-30",
      team: ["David", "Eve", "Frank", "Grace"],
      priority: "Medium"
    },
    {
      id: 3,
      name: "Data Migration Project",
      description: "Migrate legacy data to new cloud infrastructure",
      status: "Completed",
      progress: 100,
      dueDate: "2024-01-10",
      team: ["Henry", "Ivy"],
      priority: "High"
    },
    {
      id: 4,
      name: "AI Integration Phase 1",
      description: "Implement AI-powered features for automated workflows",
      status: "In Progress",
      progress: 45,
      dueDate: "2024-02-28",
      team: ["Jack", "Kate", "Liam"],
      priority: "High"
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      "Completed": "bg-green-100 text-green-800",
      "In Progress": "bg-blue-100 text-blue-800",
      "Planning": "bg-yellow-100 text-yellow-800",
      "On Hold": "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      "High": "bg-red-100 text-red-800",
      "Medium": "bg-orange-100 text-orange-800",
      "Low": "bg-green-100 text-green-800"
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-blue p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/chat")}
              variant="outline"
              size="icon"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-4xl font-bold text-white">Personal Projects</h1>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        <div className="grid gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-white/95 backdrop-blur-sm shadow-elegant border-0 hover:shadow-lg transition-all duration-300 hover-scale">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <CardDescription className="mt-1">{project.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <Badge className={getPriorityColor(project.priority)}>
                      {project.priority} Priority
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <BarChart className="h-4 w-4" />
                      Progress
                    </div>
                    <div className="space-y-2">
                      <Progress value={project.progress} className="h-2" />
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      Due Date
                    </div>
                    <p className="font-medium">{project.dueDate}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Users className="h-4 w-4" />
                      Team ({project.team.length})
                    </div>
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 3).map((member, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium border-2 border-white"
                        >
                          {member.charAt(0)}
                        </div>
                      ))}
                      {project.team.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium border-2 border-white">
                          +{project.team.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0 mt-8">
          <CardContent className="p-8 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Ready to start a new project?</h3>
            <p className="text-muted-foreground mb-4">
              Create and manage your projects with team collaboration, progress tracking, and deadline management.
            </p>
            <Button className="bg-gradient-primary hover:opacity-90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create New Project
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Projects;