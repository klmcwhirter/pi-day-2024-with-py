{
  description = "pi-day-2024-with-py";

  # Nixpkgs / NixOS version to use.
  # inputs.nixpkgs.url = "nixpkgs/nixos-23.11";

  outputs = { self, nixpkgs }: {
      # Add dependencies that are only needed for development
      devShell.x86_64-linux =
        let 
          pkgs = nixpkgs.legacyPackages.x86_64-linux;
        in pkgs.mkShell {
            packages = with pkgs; [
              docker-compose
              python312
            ];
	    shellHook = ''
	      echo -e "execute:\n\tdocker-compose up\n"
	      echo -e "start tunnel on host:\n\tssh -L 9000:localhost:9000 nixos sleep 30\n"
	      echo -e "visit browser at:\n\thttp://localhost:9000/\n"
	    '';
        };
  };
}
