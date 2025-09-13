import {Card, CardFooter, Image, Button} from "@heroui/react";

export default function CardBlurredFooter() {
  return (
    <Card isFooterBlurred className="border-none" radius="lg">
      <Image
        alt="Your custom alt text"
        className="object-cover"
        height={200}
        // Update the image category and dimensions as needed
        src="https://img.heroui.chat/image/dashboard?w=400&h=300&u=2"
        width={200}
      />
      <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <p className="text-tiny text-white/80">Your custom text here</p>
        <Button
          className="text-tiny text-white bg-black/20"
          color="default"
          radius="lg"
          size="sm"
          variant="flat"
          // Add your custom action handler
          onPress={() => console.log("Button clicked")}
        >
          Your Button Text
        </Button>
      </CardFooter>
    </Card>
  );
}
