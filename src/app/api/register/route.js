import { NextResponse } from "next/server";

export const POST = async (request) => {
  const {
    name,
    email,
    password,
    websiteUrl,
    phone,
    streetAddress,
    city,
    postalCode,
    country,
  } = await request.json();
  console.log(
    name,
    email,
    password,
    websiteUrl,
    phone,
    streetAddress,
    city,
    postalCode,
    country
  );

  if (
    !name ||
    !email ||
    !password ||
    !websiteUrl ||
    !phone ||
    !streetAddress ||
    !city ||
    !postalCode ||
    !country
  ) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }
  try {
    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
};
