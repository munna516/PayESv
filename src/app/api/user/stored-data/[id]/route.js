import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    // Delete the record (only if it belongs to the user)
    const deleteResult = await query(
      `DELETE FROM stored_data WHERE id = $1 AND email = $2 RETURNING *`,
      [id, email]
    );

    if (deleteResult.rowCount > 0) {
      return NextResponse.json({
        success: true,
        message: "Data deleted successfully"
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Record not found or you don't have permission to delete"
      }, { status: 404 });
    }

  } catch (error) {
    console.error('Error in DELETE /api/user/stored-data/[id]:', error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
} 