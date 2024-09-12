import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Playlist  from "@/lib/modals/playlist";

export const GET = async (request: Request) => {

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

        await connect();

        const user = await User.findById(userId);
            if (!user) {
                return new NextResponse(
                    JSON.stringify({ message: "User not found in the database"}),
                    { status: 400,
                     });
            }
        
        const category = await Category.findById(categoryId);
        if (!category) {
            return new NextResponse(
                JSON.stringify({ message: "Category not found "}),
                {
                    status: 404,
                }
            )
        }

        // TODO

        const filter: any = {
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId),
        };

        const playlists = await Playlist.find(filter);

        return new NextResponse(JSON.stringify({ playlists }), {
            status: 200,
        });

    } catch (error: any) {
        
    }
};

export const POST = async (request: Request) => {
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get("userId");
      const categoryId = searchParams.get("categoryId");
  
      const body = await request.json();
      const { title, description } = body;
  
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
  
      const newPlaylist = new Playlist({
        title,
        description,
        user: new Types.ObjectId(userId),
        category: new Types.ObjectId(categoryId),
      });
  
      await newPlaylist.save();
      return new NextResponse(
        JSON.stringify({ message: "Playlist is created", playlist: newPlaylist }),
        { status: 200 }
      );
    } catch (error: any) {
      return new NextResponse("Error in fetching playlists" + error.message, {
        status: 500,
      });
    }
  };