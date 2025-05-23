"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import type { User } from "@/lib/mock-data"

interface AccountSettingsProps {
  user: User
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const [fullName, setFullName] = useState(user.fullName || "")
  const [username, setUsername] = useState(user.username || "")
  const [email, setEmail] = useState(user.email || "")
  const [bio, setBio] = useState(user.bio || "")
  const [website, setWebsite] = useState(user.website || "")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const { updateProfile } = useAuth()
  const { toast } = useToast()

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true)

      await updateProfile({
        fullName,
        username,
        bio,
        website,
      })

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotifications = () => {
    // In a real app, this would update notification settings
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
              className="bg-gray-700 border-gray-600 opacity-70"
            />
            <p className="text-xs text-gray-400">Email cannot be changed</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="bg-gray-700 border-gray-600"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="bg-bitcoin hover:bg-bitcoin/90 text-black ml-auto"
            onClick={handleSaveProfile}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-gray-400">Receive order updates and important announcements</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-bitcoin hover:bg-bitcoin/90 text-black ml-auto" onClick={handleSaveNotifications}>
            Save Preferences
          </Button>
        </CardFooter>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Change Password</Button>
        </CardContent>
      </Card>
    </div>
  )
}
