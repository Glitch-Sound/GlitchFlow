import Foundation
import ImageIO
import UniformTypeIdentifiers

let frameDirectory = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "test-results/marketing-gif-frames"
let outputPath = CommandLine.arguments.count > 2 ? CommandLine.arguments[2] : "docs/images/glitchflow-overview.gif"
let frameCount = CommandLine.arguments.count > 3 ? Int(CommandLine.arguments[3])! : 8
let frames = (0..<frameCount).map { String(format: "\(frameDirectory)/%02d.png", $0) }
let destinationURL = URL(fileURLWithPath: outputPath)
guard let destination = CGImageDestinationCreateWithURL(destinationURL as CFURL, UTType.gif.identifier as CFString, frames.count, nil) else {
    fatalError("GIF destination could not be created")
}
let gifOptions = [kCGImagePropertyGIFDictionary: [kCGImagePropertyGIFLoopCount: 0]] as CFDictionary
CGImageDestinationSetProperties(destination, gifOptions)
for (index, path) in frames.enumerated() {
    guard let source = CGImageSourceCreateWithURL(URL(fileURLWithPath: path) as CFURL, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
        fatalError("Cannot read \(path)")
    }
    let delay = index.isMultiple(of: 2) ? 1.0 : 2.0
    let properties = [kCGImagePropertyGIFDictionary: [kCGImagePropertyGIFDelayTime: delay]] as CFDictionary
    CGImageDestinationAddImage(destination, image, properties)
}
guard CGImageDestinationFinalize(destination) else { fatalError("GIF could not be written") }
let size = try FileManager.default.attributesOfItem(atPath: destinationURL.path)[.size] as! Int
guard let gif = CGImageSourceCreateWithURL(destinationURL as CFURL, nil), CGImageSourceGetCount(gif) == frames.count else {
    fatalError("GIF frame count is incorrect")
}
guard size <= 3_000_000 else { fatalError("GIF exceeds 3 MB") }
print("\(destinationURL.path): \(size) bytes")
