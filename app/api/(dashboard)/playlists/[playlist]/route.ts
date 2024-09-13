import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Playlist  from "@/lib/modals/playlist";

export const GET = async (request: Request, context: { params: any }) => {
    const playlistId = context.params.playlist;
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get("userId");
      const categoryId = searchParams.get("categoryId");
  
      if (!userId || !Types.ObjectId.isValid(userId)) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid or missing userId" }),
          { status: 400 }
        );
      }
  
      if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid or missing categoryId" }),
          { status: 400 }
        );
      }
  
      if (!playlistId || !Types.ObjectId.isValid(playlistId)) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid or missing playlistId" }),
          { status: 400 }
        );
      }
  
      await connect();
  
      const user = await User.findById(userId);
      if (!user) {
        return new NextResponse(JSON.stringify({ message: "User not found" }), {
          status: 404,
        });
      }
      const category = await Category.findById(categoryId);
      if (!category) {
        return new NextResponse(
          JSON.stringify({ message: "Category not found" }),
          {
            status: 404,
          }
        );
      }
  
      const playlist = await Playlist.findOne({
        _id: playlistId,
        user: userId,
        category: categoryId,
      });
  
      if (!playlist) {
        return new NextResponse(JSON.stringify({ message: "Playlist not found" }), {
          status: 404,
        });
      }
  
      return new NextResponse(JSON.stringify({ playlist }), {
        status: 200,
      });
    } catch (error: any) {
      return new NextResponse("Error in fetching a playlist" + error.message, {
        status: 500,
      });
    }
  };

  export const PATCH = async (request: Request, context: { params: any }) => {
    const playlistId = context.params.playlist;
    
    try {
      const body = await request.json();
      const { title, description } = body;
      
      
      const { searchParams } = new URL(request.url);


      const userId = searchParams.get("userId");

      if (!userId ||!Types.ObjectId.isValid(userId)) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid or missing playlistID" }),
          { status: 400 }
        );
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
          return new NextResponse(JSON.stringify({ message: "User not found" }), {
            status: 404,
          });
        }
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
          return new NextResponse(
            JSON.stringify({ message: "Playlist not found" }),
            {
              status: 404,
            }
          );
        }

        const updatedPlaylist = await Playlist.findByIdAndUpdate(
          playlistId,
          { title, description },
          { new: true}
        );

        return new NextResponse(
          JSON.stringify({ message: "Playlist Updated", playlist: updatedPlaylist }),
          {status: 200}
        );

    } catch (error: any) {
      return new NextResponse("Error in updating a playlist" + error.message, {
        status: 500,
      });
    }
  };

  export const DELETE = async (request: Request, context: { params: any }) => {
    const playlistId = context.params.playlist;
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get("userId");
  
      if (!userId || !Types.ObjectId.isValid(userId)) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid or missing userId" }),
          { status: 400 }
        );
      }
  
      if (!playlistId || !Types.ObjectId.isValid(playlistId)) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid or missing playlistId" }),
          { status: 400 }
        );
      }
  
      await connect();
  
      const user = await User.findById(userId);
      if (!user) {
        return new NextResponse(JSON.stringify({ message: "User not found" }), {
          status: 404,
        });
      }
      const playlist = await Playlist.findOne({ _id: playlistId, user: userId });
      if (!playlist) {
        return new NextResponse(JSON.stringify({ message: "Playlist not found" }), {
          status: 404,
        });
      }
  
      await Playlist.findByIdAndDelete(playlistId);
  
      return new NextResponse(JSON.stringify({ message: "Playlist is deleted" }), {
        status: 200,
      });
    } catch (error: any) {
      return new NextResponse("Error in deleting playlist" + error.message, {
        status: 500,
      });
    }
  };