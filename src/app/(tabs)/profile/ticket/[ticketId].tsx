import TicketDetails from "@/components/TicketDetails";

export default function TicketScreen() {
  // Fetch ticket data here
  const ticketData = {
    _id: "67ae3c19f4ceea995c85860a",
    orderId: "67ae3c00f4ceea995c858607",
    totalAmount: 623.04,
    event: {
      address: {
        street: "IIT Delhi Main Road",
        city: "New Delhi",
        state: "Delhi",
        postalCode: "110016",
        country: "India",
        latitude: 28.5443886,
        longitude: 77.19271239999999,
      },
      instructor: {
        name: "Jatin",
        description: "Something",
        imageUrl:
          "https://utfs.io/f/fe35f660-94b1-4544-b16e-ecc0dbac5714-k4c48b.png",
        url: "https://github.com/adrianhajdin/event_platform",
      },
      _id: "67a7206817ae28b1c57ae990",
      title: "Test-File-Upload",
      description: "random description",
      overview: "Something",
      locationType: "In-Person" as "In-Person" | "Online" | "To-Be-Decided",
      ageRange: { min: 7, max: 14, _id: "67a7206817ae28b1c57ae991" },
      imageUrl:
        "https://utfs.io/f/b674ee57-d004-4302-a458-456ff196e13a-ng6bfi.jpg.webp",

      startDateTime: new Date("2025-02-18T10:00:00.000Z"),
      endDateTime: new Date("2025-02-18T11:30:00.000Z"),
      price: "528",
      isFree: false,
      category: { _id: "67a0d00934e063120e6d7697", name: "Block Building" },
      organizer: {
        _id: "67a488c1887f16ef0e544e9d",
        username: "jatinitest",
        firstName: "Jatin",
        lastName: "Tilwani",
      },
      no_of_tickets: 62,
      createdAt: "2025-02-08T09:14:16.173Z",
      __v: 0,
    },
    buyer: {
      _id: "67ab3e97ae7270fa912e4eb0",
      firstName: "Jatin",
      lastName: "Tilwani",
    },
    child: {
      _id: "67ae2685f4ceea995c8585e0",
      firstName: "Test",
      lastName: "Child",
      dob: new Date("2025-02-03T00:00:00.000Z"),
      gender: "Male",
      parent_id: "67ab3e97ae7270fa912e4eb0",
      __v: 0,
    },
    createdAt: new Date("2025-02-13T18:38:17.065Z"),
    __v: 0,
  };
  return <TicketDetails ticket={ticketData} userId={"someuserId"} />;
}
